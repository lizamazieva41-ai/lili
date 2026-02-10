{
  "targets": [
    {
      "target_name": "tdlib",
      "sources": ["tdlib_addon.cc"],
      "cflags_cc": ["-std=c++17"],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
      "libraries": [],
      "conditions": [
        [
          "OS==\"linux\"",
          {
            "libraries": [
              "-Wl,-rpath,'$$ORIGIN/../../vendor/tdlib/lib'",
              "-L../../vendor/tdlib/lib",
              "-ltdjson"
            ]
          }
        ],
        [
          "OS==\"win\"",
          {
            "libraries": [
              "../../vendor/tdlib/lib/tdjson.lib"
            ],
            "library_dirs": [
              "../../vendor/tdlib/lib"
            ]
          }
        ]
      ]
    }
  ]
}

