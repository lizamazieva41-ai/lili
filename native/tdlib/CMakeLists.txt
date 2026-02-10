# CMakeLists.txt for building tdlib_addon_test
cmake_minimum_required(VERSION 3.10)

project(tdlib_addon_test)

add_executable(tdlib_addon_test tdlib_addon_test.cc)

target_compile_options(tdlib_addon_test PRIVATE -std=c++17)
