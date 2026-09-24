#----------------------------------------------------------------
# Generated CMake target import file for configuration "MinSizeRel".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "OBS::w32-pthreads" for configuration "MinSizeRel"
set_property(TARGET OBS::w32-pthreads APPEND PROPERTY IMPORTED_CONFIGURATIONS MINSIZEREL)
set_target_properties(OBS::w32-pthreads PROPERTIES
  IMPORTED_IMPLIB_MINSIZEREL "${_IMPORT_PREFIX}/lib/w32-pthreads.lib"
  IMPORTED_LOCATION_MINSIZEREL "${_IMPORT_PREFIX}/bin/64bit/w32-pthreads.dll"
  )

list(APPEND _cmake_import_check_targets OBS::w32-pthreads )
list(APPEND _cmake_import_check_files_for_OBS::w32-pthreads "${_IMPORT_PREFIX}/lib/w32-pthreads.lib" "${_IMPORT_PREFIX}/bin/64bit/w32-pthreads.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
