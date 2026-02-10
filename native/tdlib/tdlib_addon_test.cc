// Simple smoke test for native addon
// This file can be compiled separately to test the addon without Node.js

#include <iostream>
#include <dlfcn.h>
#include <string>

// Minimal test to verify library can be loaded
int main() {
  const char* libPath = "../../vendor/tdlib/lib/libtdjson.so";
  const char* envPath = std::getenv("TDLIB_LIBRARY_PATH");
  if (envPath) {
    libPath = envPath;
  }

  void* handle = dlopen(libPath, RTLD_NOW);
  if (!handle) {
    std::cerr << "ERROR: Failed to load library: " << dlerror() << std::endl;
    return 1;
  }

  // Check for required symbols
  const char* symbols[] = {
    "td_json_client_create",
    "td_json_client_send",
    "td_json_client_receive",
    "td_json_client_execute",
    "td_json_client_destroy"
  };

  int missing = 0;
  for (const char* sym : symbols) {
    void* ptr = dlsym(handle, sym);
    if (!ptr) {
      std::cerr << "ERROR: Symbol not found: " << sym << std::endl;
      missing++;
    } else {
      std::cout << "OK: Found symbol " << sym << std::endl;
    }
  }

  dlclose(handle);

  if (missing > 0) {
    std::cerr << "FAILED: " << missing << " symbols missing" << std::endl;
    return 1;
  }

  std::cout << "SUCCESS: All symbols found" << std::endl;
  return 0;
}
