#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "OBS::obs-frontend-api" for configuration "Release"
set_property(TARGET OBS::obs-frontend-api APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(OBS::obs-frontend-api PROPERTIES
  IMPORTED_IMPLIB_RELEASE "${_IMPORT_PREFIX}/lib/obs-frontend-api.lib"
  IMPORTED_LINK_DEPENDENT_LIBRARIES_RELEASE "OBS::libobs"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/64bit/obs-frontend-api.dll"
  )

list(APPEND _cmake_import_check_targets OBS::obs-frontend-api )
list(APPEND _cmake_import_check_files_for_OBS::obs-frontend-api "${_IMPORT_PREFIX}/lib/obs-frontend-api.lib" "${_IMPORT_PREFIX}/bin/64bit/obs-frontend-api.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
