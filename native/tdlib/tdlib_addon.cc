#include <napi.h>
#include <string>
#include <unordered_map>
#include <mutex>
#include <memory>
#include <vector>
#include <cstdlib>

// Platform-specific includes
#ifdef _WIN32
#include <windows.h>
#else
#include <dlfcn.h>
#include <unistd.h>
#include <limits.h>
#endif

// TDLib C JSON interface signatures (declared manually to avoid header dependency)
using td_json_client_create_t = void* (*)();
using td_json_client_send_t = void (*)(void*, const char*);
using td_json_client_receive_t = const char* (*)(void*, double);
using td_json_client_execute_t = const char* (*)(void*, const char*);
using td_json_client_destroy_t = void (*)(void*);

struct TdJsonApi {
  void* handle{nullptr};
  td_json_client_create_t create{nullptr};
  td_json_client_send_t send{nullptr};
  td_json_client_receive_t receive{nullptr};
  td_json_client_execute_t execute{nullptr};
  td_json_client_destroy_t destroy{nullptr};
  bool initialized{false};
  
  // Thread-safe initialization flag
  std::mutex init_mutex;
};

// Global API instance with thread-safe access
static TdJsonApi g_api;
static std::mutex g_api_mutex;

// Thread-safe client map
static std::unordered_map<std::string, void*> g_clients;
static std::mutex g_clients_mutex;
static uint64_t g_clientCounter = 0;
static std::mutex g_counter_mutex;

// Error codes
enum class TdlibError {
  LIBRARY_NOT_LOADED,
  SYMBOL_NOT_FOUND,
  CLIENT_NOT_FOUND,
  CLIENT_CREATE_FAILED,
  INVALID_ARGUMENT,
  UNKNOWN_ERROR
};

static std::string get_error_message(TdlibError error, const std::string& details = "") {
  switch (error) {
    case TdlibError::LIBRARY_NOT_LOADED:
      return "TDLib library not loaded: " + details;
    case TdlibError::SYMBOL_NOT_FOUND:
      return "TDLib symbol not found: " + details;
    case TdlibError::CLIENT_NOT_FOUND:
      return "TDLib client not found: " + details;
    case TdlibError::CLIENT_CREATE_FAILED:
      return "Failed to create TDLib client: " + details;
    case TdlibError::INVALID_ARGUMENT:
      return "Invalid argument: " + details;
    case TdlibError::UNKNOWN_ERROR:
      return "Unknown error: " + details;
    default:
      return "Unknown error";
  }
}

static void load_tdjson(const std::string& path) {
  std::lock_guard<std::mutex> lock(g_api.init_mutex);
  
  if (g_api.initialized && g_api.handle) {
    return;
  }

#ifdef _WIN32
  // Windows: Use LoadLibrary
  std::wstring wpath(path.begin(), path.end());
  g_api.handle = LoadLibraryW(wpath.c_str());
  if (!g_api.handle) {
    DWORD error = GetLastError();
    std::string error_msg = "Windows error code: " + std::to_string(error);
    throw std::runtime_error(get_error_message(TdlibError::LIBRARY_NOT_LOADED, error_msg));
  }

  g_api.create = reinterpret_cast<td_json_client_create_t>(GetProcAddress(static_cast<HMODULE>(g_api.handle), "td_json_client_create"));
  if (!g_api.create) {
    FreeLibrary(static_cast<HMODULE>(g_api.handle));
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_create"));
  }

  g_api.send = reinterpret_cast<td_json_client_send_t>(GetProcAddress(static_cast<HMODULE>(g_api.handle), "td_json_client_send"));
  if (!g_api.send) {
    FreeLibrary(static_cast<HMODULE>(g_api.handle));
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_send"));
  }

  g_api.receive = reinterpret_cast<td_json_client_receive_t>(GetProcAddress(static_cast<HMODULE>(g_api.handle), "td_json_client_receive"));
  if (!g_api.receive) {
    FreeLibrary(static_cast<HMODULE>(g_api.handle));
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_receive"));
  }

  g_api.execute = reinterpret_cast<td_json_client_execute_t>(GetProcAddress(static_cast<HMODULE>(g_api.handle), "td_json_client_execute"));
  if (!g_api.execute) {
    FreeLibrary(static_cast<HMODULE>(g_api.handle));
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_execute"));
  }

  g_api.destroy = reinterpret_cast<td_json_client_destroy_t>(GetProcAddress(static_cast<HMODULE>(g_api.handle), "td_json_client_destroy"));
  if (!g_api.destroy) {
    FreeLibrary(static_cast<HMODULE>(g_api.handle));
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_destroy"));
  }
#else
  // Unix/Linux: Use dlopen
  g_api.handle = dlopen(path.c_str(), RTLD_NOW | RTLD_GLOBAL);
  if (!g_api.handle) {
    const char* dlerr = dlerror();
    std::string error_msg = dlerr ? std::string(dlerr) : "Unknown error";
    throw std::runtime_error(get_error_message(TdlibError::LIBRARY_NOT_LOADED, error_msg));
  }

  // Clear any previous errors
  dlerror();

  g_api.create = reinterpret_cast<td_json_client_create_t>(dlsym(g_api.handle, "td_json_client_create"));
  if (dlerror() != nullptr) {
    dlclose(g_api.handle);
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_create"));
  }

  g_api.send = reinterpret_cast<td_json_client_send_t>(dlsym(g_api.handle, "td_json_client_send"));
  if (dlerror() != nullptr) {
    dlclose(g_api.handle);
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_send"));
  }

  g_api.receive = reinterpret_cast<td_json_client_receive_t>(dlsym(g_api.handle, "td_json_client_receive"));
  if (dlerror() != nullptr) {
    dlclose(g_api.handle);
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_receive"));
  }

  g_api.execute = reinterpret_cast<td_json_client_execute_t>(dlsym(g_api.handle, "td_json_client_execute"));
  if (dlerror() != nullptr) {
    dlclose(g_api.handle);
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_execute"));
  }

  g_api.destroy = reinterpret_cast<td_json_client_destroy_t>(dlsym(g_api.handle, "td_json_client_destroy"));
  if (dlerror() != nullptr) {
    dlclose(g_api.handle);
    g_api = TdJsonApi{};
    throw std::runtime_error(get_error_message(TdlibError::SYMBOL_NOT_FOUND, "td_json_client_destroy"));
  }
#endif

  g_api.initialized = true;
}

/**
 * Get the directory where the addon is located
 */
static std::string get_addon_directory() {
#ifdef _WIN32
  HMODULE hModule = NULL;
  if (GetModuleHandleEx(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
                        (LPCTSTR)&get_addon_directory, &hModule)) {
    wchar_t path[MAX_PATH];
    if (GetModuleFileNameW(hModule, path, MAX_PATH)) {
      std::wstring wpath(path);
      std::string exe_path(wpath.begin(), wpath.end());
      size_t last_slash = exe_path.find_last_of('\\');
      if (last_slash != std::string::npos) {
        return exe_path.substr(0, last_slash + 1);
      }
    }
  }
  return "";
#else
  char path[PATH_MAX];
  ssize_t count = readlink("/proc/self/exe", path, PATH_MAX);
  if (count != -1) {
    std::string exe_path(path, count);
    size_t last_slash = exe_path.find_last_of('/');
    if (last_slash != std::string::npos) {
      return exe_path.substr(0, last_slash + 1);
    }
  }
  return "";
#endif
}

/**
 * Resolve absolute path from relative path
 */
static std::string resolve_path(const std::string& base_dir, const std::string& relative_path) {
  if (relative_path.empty()) {
    return relative_path;
  }
  
#ifdef _WIN32
  // Windows: Handle both / and \ separators
  std::string resolved = base_dir;
  if (!resolved.empty() && resolved.back() != '\\' && resolved.back() != '/') {
    resolved += '\\';
  }
  resolved += relative_path;
  
  // Normalize path separators
  for (char& c : resolved) {
    if (c == '/') {
      c = '\\';
    }
  }
  
  // Use Windows API to get full path
  wchar_t full_path[MAX_PATH];
  std::wstring wresolved(resolved.begin(), resolved.end());
  if (GetFullPathNameW(wresolved.c_str(), MAX_PATH, full_path, nullptr)) {
    std::wstring wresult(full_path);
    return std::string(wresult.begin(), wresult.end());
  }
  
  return resolved;
#else
  // If already absolute, return as-is
  if (relative_path[0] == '/') {
    return relative_path;
  }
  
  // Resolve relative to base directory
  std::string resolved = base_dir;
  if (!resolved.empty() && resolved.back() != '/') {
    resolved += '/';
  }
  resolved += relative_path;
  
  // Normalize path (resolve .. and .)
  char* real_path = realpath(resolved.c_str(), nullptr);
  if (real_path) {
    std::string result(real_path);
    free(real_path);
    return result;
  }
  
  return resolved;
#endif
}

/**
 * Get candidate paths for TDLib library
 */
static std::vector<std::string> get_tdjson_candidate_paths() {
  std::vector<std::string> paths;
  
  // 1. Environment variable (highest priority)
  const char* env_path = std::getenv("TDLIB_LIBRARY_PATH");
  if (env_path && strlen(env_path) > 0) {
    paths.push_back(std::string(env_path));
  }
  
  // Get addon directory for relative path resolution
  std::string addon_dir = get_addon_directory();
  
  // 2. Relative path from addon (default)
#ifdef _WIN32
  // native/tdlib/build/Release/tdlib.node -> ../../vendor/tdlib/lib/tdjson.dll
  paths.push_back(resolve_path(addon_dir, "..\\..\\vendor\\tdlib\\lib\\tdjson.dll"));
  paths.push_back(resolve_path(addon_dir, "../../vendor/tdlib/lib/tdjson.dll"));
#else
  // native/tdlib/build/Release/tdlib.node -> ../../vendor/tdlib/lib/libtdjson.so
  paths.push_back(resolve_path(addon_dir, "../../vendor/tdlib/lib/libtdjson.so"));
  
  // 3. Absolute path in project (common deployment)
  paths.push_back("/app/native/vendor/tdlib/lib/libtdjson.so");
  paths.push_back("/usr/src/app/native/vendor/tdlib/lib/libtdjson.so");
#endif
  
  // 4. System library paths
  paths.push_back("/usr/local/lib/libtdjson.so");
  paths.push_back("/opt/tdlib/lib/libtdjson.so");
  paths.push_back("/usr/lib/libtdjson.so");
  
  return paths;
}

/**
 * Try to load library from a path, return true if successful
 */
static bool try_load_tdjson(const std::string& path) {
  if (path.empty()) {
    return false;
  }
  
#ifdef _WIN32
  std::wstring wpath(path.begin(), path.end());
  HMODULE handle = LoadLibraryW(wpath.c_str());
  if (handle) {
    // Check if required symbols exist
    void* create_sym = GetProcAddress(handle, "td_json_client_create");
    if (create_sym != nullptr) {
      // Library loaded successfully, close and return true
      // (We'll reload it properly in load_tdjson)
      FreeLibrary(handle);
      return true;
    }
    
    FreeLibrary(handle);
  }
#else
  void* handle = dlopen(path.c_str(), RTLD_NOW | RTLD_GLOBAL);
  if (handle) {
    // Check if required symbols exist
    dlerror(); // Clear any previous errors
    
    void* create_sym = dlsym(handle, "td_json_client_create");
    if (dlerror() == nullptr && create_sym != nullptr) {
      // Library loaded successfully, close and return true
      // (We'll reload it properly in load_tdjson)
      dlclose(handle);
      return true;
    }
    
    if (handle) {
      dlclose(handle);
    }
  }
#endif
  
  return false;
}

/**
 * Find and return the first valid library path
 */
static std::string find_tdjson_library_path() {
  std::vector<std::string> candidates = get_tdjson_candidate_paths();
  std::string last_error;
  
  for (const auto& path : candidates) {
    if (try_load_tdjson(path)) {
      return path;
    }
    
    // Collect error for better error message
    const char* dlerr = dlerror();
    if (dlerr) {
      last_error = std::string(dlerr);
    }
  }
  
  // If no path worked, throw with detailed error
  std::string error_msg = "TDLib library not found. Tried paths:\n";
  for (size_t i = 0; i < candidates.size(); ++i) {
    error_msg += "  " + std::to_string(i + 1) + ". " + candidates[i] + "\n";
  }
  if (!last_error.empty()) {
    error_msg += "Last error: " + last_error;
  }
  error_msg += "\nSet TDLIB_LIBRARY_PATH environment variable to specify the library path.";
  
  throw std::runtime_error(error_msg);
}

class CreateClientWorker : public Napi::AsyncWorker {
 public:
  CreateClientWorker(const Napi::Env& env, const Napi::Function& cb)
      : Napi::AsyncWorker(cb), deferred(Napi::Promise::Deferred::New(env)) {}

  void Execute() override {
    try {
      // Find library path with fallbacks
      std::string libPath = find_tdjson_library_path();
      
      load_tdjson(libPath);

      {
        std::lock_guard<std::mutex> api_lock(g_api_mutex);
        if (!g_api.create) {
          SetError(get_error_message(TdlibError::LIBRARY_NOT_LOADED, "API not initialized"));
          return;
        }
      }

      void* client = nullptr;
      {
        std::lock_guard<std::mutex> api_lock(g_api_mutex);
        client = g_api.create();
      }
      
      if (!client) {
        SetError(get_error_message(TdlibError::CLIENT_CREATE_FAILED, "td_json_client_create returned null"));
        return;
      }

      {
        std::lock_guard<std::mutex> counter_lock(g_counter_mutex);
        id = "tdc-" + std::to_string(++g_clientCounter);
      }

      {
        std::lock_guard<std::mutex> clients_lock(g_clients_mutex);
        g_clients[id] = client;
      }
    } catch (const std::exception& ex) {
      SetError(ex.what());
    } catch (...) {
      SetError(get_error_message(TdlibError::UNKNOWN_ERROR, "Unknown exception in CreateClientWorker"));
    }
  }

  void OnOK() override {
    Napi::HandleScope scope(Env());
    Callback().Call({Env().Null(), Napi::String::New(Env(), id)});
    deferred.Resolve(Napi::String::New(Env(), id));
  }

  void OnError(const Napi::Error& e) override {
    Napi::HandleScope scope(Env());
    Callback().Call({e.Value(), Env().Undefined()});
    deferred.Reject(e.Value());
  }

  Napi::Promise GetPromise() const { return deferred.Promise(); }

 private:
  std::string id;
  Napi::Promise::Deferred deferred;
};

Napi::Value CreateClient(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsFunction()) {
    Napi::TypeError::New(env, "Callback function required").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::Function cb = info[0].As<Napi::Function>();
  auto* worker = new CreateClientWorker(env, cb);
  worker->Queue();
  return worker->GetPromise();
}

Napi::Value DestroyClient(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "clientId (string) required").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  const std::string clientId = info[0].As<Napi::String>().Utf8Value();
  
  {
    std::lock_guard<std::mutex> clients_lock(g_clients_mutex);
    auto it = g_clients.find(clientId);
    
    if (it == g_clients.end()) {
      Napi::Error::New(env, get_error_message(TdlibError::CLIENT_NOT_FOUND, clientId))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    
    void* client = it->second;
    g_clients.erase(it);
    
    {
      std::lock_guard<std::mutex> api_lock(g_api_mutex);
      if (g_api.destroy && client) {
        g_api.destroy(client);
      }
    }
  }
  
  return env.Undefined();
}

Napi::Value Send(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
    Napi::TypeError::New(env, "clientId (string) and request (string) required")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  
  const std::string clientId = info[0].As<Napi::String>().Utf8Value();
  const std::string request = info[1].As<Napi::String>().Utf8Value();
  
  void* client = nullptr;
  {
    std::lock_guard<std::mutex> clients_lock(g_clients_mutex);
    auto it = g_clients.find(clientId);
    if (it == g_clients.end()) {
      Napi::Error::New(env, get_error_message(TdlibError::CLIENT_NOT_FOUND, clientId))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    client = it->second;
  }
  
  {
    std::lock_guard<std::mutex> api_lock(g_api_mutex);
    if (!g_api.send) {
      Napi::Error::New(env, get_error_message(TdlibError::LIBRARY_NOT_LOADED, "send function not available"))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    g_api.send(client, request.c_str());
  }
  
  return env.Undefined();
}

Napi::Value Receive(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 2 || !info[0].IsString() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "clientId (string) and timeout (number) required")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  
  const std::string clientId = info[0].As<Napi::String>().Utf8Value();
  double timeout = info[1].As<Napi::Number>().DoubleValue();
  
  // Validate timeout
  if (timeout < 0.0 || timeout > 300.0) {
    Napi::TypeError::New(env, "Timeout must be between 0 and 300 seconds")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  
  void* client = nullptr;
  {
    std::lock_guard<std::mutex> clients_lock(g_clients_mutex);
    auto it = g_clients.find(clientId);
    if (it == g_clients.end()) {
      Napi::Error::New(env, get_error_message(TdlibError::CLIENT_NOT_FOUND, clientId))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    client = it->second;
  }
  
  const char* result = nullptr;
  {
    std::lock_guard<std::mutex> api_lock(g_api_mutex);
    if (!g_api.receive) {
      Napi::Error::New(env, get_error_message(TdlibError::LIBRARY_NOT_LOADED, "receive function not available"))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    result = g_api.receive(client, timeout);
  }
  
  if (!result) {
    return env.Null();
  }
  
  return Napi::String::New(env, result);
}

Napi::Value Execute(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "request (string) required").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  const std::string request = info[0].As<Napi::String>().Utf8Value();
  
  const char* result = nullptr;
  {
    std::lock_guard<std::mutex> api_lock(g_api_mutex);
    if (!g_api.execute) {
      Napi::Error::New(env, get_error_message(TdlibError::LIBRARY_NOT_LOADED, "execute function not available"))
          .ThrowAsJavaScriptException();
      return env.Null();
    }
    result = g_api.execute(nullptr, request.c_str());
  }
  
  if (!result) {
    return env.Null();
  }
  
  return Napi::String::New(env, result);
}

Napi::Value GetLibraryInfo(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object result = Napi::Object::New(env);
  
  {
    std::lock_guard<std::mutex> api_lock(g_api_mutex);
    result.Set("initialized", Napi::Boolean::New(env, g_api.initialized));
    result.Set("handle", Napi::Number::New(env, reinterpret_cast<uintptr_t>(g_api.handle)));
    result.Set("hasCreate", Napi::Boolean::New(env, g_api.create != nullptr));
    result.Set("hasSend", Napi::Boolean::New(env, g_api.send != nullptr));
    result.Set("hasReceive", Napi::Boolean::New(env, g_api.receive != nullptr));
    result.Set("hasExecute", Napi::Boolean::New(env, g_api.execute != nullptr));
    result.Set("hasDestroy", Napi::Boolean::New(env, g_api.destroy != nullptr));
  }
  
  {
    std::lock_guard<std::mutex> clients_lock(g_clients_mutex);
    result.Set("clientCount", Napi::Number::New(env, g_clients.size()));
  }
  
  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "createClient"), Napi::Function::New(env, CreateClient));
  exports.Set(Napi::String::New(env, "destroyClient"), Napi::Function::New(env, DestroyClient));
  exports.Set(Napi::String::New(env, "send"), Napi::Function::New(env, Send));
  exports.Set(Napi::String::New(env, "receive"), Napi::Function::New(env, Receive));
  exports.Set(Napi::String::New(env, "execute"), Napi::Function::New(env, Execute));
  exports.Set(Napi::String::New(env, "getLibraryInfo"), Napi::Function::New(env, GetLibraryInfo));
  return exports;
}

NODE_API_MODULE(tdlib, Init)
