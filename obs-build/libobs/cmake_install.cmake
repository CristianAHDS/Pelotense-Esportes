# Install script for directory: C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/obs-dist")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/deps/libcaption/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/deps/w32-pthreads/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Debug/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Release/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/MinSizeRel/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/RelWithDebInfo/obs.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Debug/obs.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Release/obs.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/RelWithDebInfo/obs.pdb")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/data/libobs" TYPE DIRECTORY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/data/" USE_SOURCE_PERMISSIONS)
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Debug/obs.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Release/obs.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/MinSizeRel/obs.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/RelWithDebInfo/obs.lib")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Debug/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Release/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/MinSizeRel/obs.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE SHARED_LIBRARY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/RelWithDebInfo/obs.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/callback" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/callback/calldata.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/callback/decl.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/callback/proc.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/callback/signal.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/graphics" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/axisang.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/bounds.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/effect-parser.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/effect.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/graphics.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/image-file.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/input.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/math-defs.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/math-extra.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/matrix3.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/matrix4.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/plane.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/quat.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/shader-parser.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/srgb.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/vec2.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/vec3.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/vec4.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/graphics/libnsgif" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/graphics/libnsgif/nsgif.h")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/media-io" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/audio-io.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/audio-math.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/audio-resampler.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/format-conversion.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/frame-rate.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/media-io-defs.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/media-remux.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/video-frame.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/video-io.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/media-io/video-scaler.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/util" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/array-serializer.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/base.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/bitstream.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/bmem.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/c99defs.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/cf-lexer.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/cf-parser.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/config-file.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/crc32.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/darray.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/deque.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/dstr.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/dstr.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/file-serializer.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/lexer.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/pipe.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/platform.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/profiler.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/profiler.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/serializer.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/sse-intrin.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/task.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/text-lookup.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/threading-posix.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/threading.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/uthash.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/util.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/util_uint128.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/util_uint64.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/threading-windows.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/util/windows" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/ComPtr.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/CoTaskMemPtr.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/device-enum.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/HRError.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/win-registry.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/win-version.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/window-helpers.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/util/windows/WinHandle.hpp"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-audio-controls.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-avc.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-config.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-data.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-defs.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-encoder.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-hotkey.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-hotkeys.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-interaction.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-missing-files.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-module.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-nal.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-nix-platform.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-output.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-properties.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-service.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-source.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs.h"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs.hpp"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/libobs/obs-hevc.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/config/obsconfig.h")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/libobsTargets.cmake")
    file(DIFFERENT _cmake_export_file_changed FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/libobsTargets.cmake"
         "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets.cmake")
    if(_cmake_export_file_changed)
      file(GLOB _cmake_old_config_files "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/libobsTargets-*.cmake")
      if(_cmake_old_config_files)
        string(REPLACE ";" ", " _cmake_old_config_files_text "${_cmake_old_config_files}")
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/libobsTargets.cmake\" will be replaced.  Removing files [${_cmake_old_config_files_text}].")
        unset(_cmake_old_config_files_text)
        file(REMOVE ${_cmake_old_config_files})
      endif()
      unset(_cmake_old_config_files)
    endif()
    unset(_cmake_export_file_changed)
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets.cmake")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets-debug.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets-minsizerel.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets-relwithdebinfo.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/libobsTargets-release.cmake")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/libobsConfig.cmake"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/libobsConfigVersion.cmake"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake/finders" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/cmake/finders/FindSIMDe.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Debug/obs.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/Release/obs.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/RelWithDebInfo/obs.pdb")
  endif()
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/libobs/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
