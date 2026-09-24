#----------------------------------------------------------------
# Generated CMake target import file for configuration "MinSizeRel".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "OBS::libobs" for configuration "MinSizeRel"
set_property(TARGET OBS::libobs APPEND PROPERTY IMPORTED_CONFIGURATIONS MINSIZEREL)
set_target_properties(OBS::libobs PROPERTIES
  IMPORTED_IMPLIB_MINSIZEREL "${_IMPORT_PREFIX}/lib/obs.lib"
  IMPORTED_LINK_DEPENDENT_LIBRARIES_MINSIZEREL "FFmpeg::avcodec;FFmpeg::avformat;FFmpeg::avutil;FFmpeg::swscale;FFmpeg::swresample"
  IMPORTED_LOCATION_MINSIZEREL "${_IMPORT_PREFIX}/bin/64bit/obs.dll"
  )

list(APPEND _cmake_import_check_targets OBS::libobs )
list(APPEND _cmake_import_check_files_for_OBS::libobs "${_IMPORT_PREFIX}/lib/obs.lib" "${_IMPORT_PREFIX}/bin/64bit/obs.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
