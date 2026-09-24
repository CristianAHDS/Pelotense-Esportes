# Install script for directory: C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/obs-websocket

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

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/obs-websocket/lib/obs-websocket-api.h")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/obs-websocket-apiTargets.cmake")
    file(DIFFERENT _cmake_export_file_changed FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/obs-websocket-apiTargets.cmake"
         "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/obs-websocket-apiTargets.cmake")
    if(_cmake_export_file_changed)
      file(GLOB _cmake_old_config_files "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/obs-websocket-apiTargets-*.cmake")
      if(_cmake_old_config_files)
        string(REPLACE ";" ", " _cmake_old_config_files_text "${_cmake_old_config_files}")
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/obs-websocket-apiTargets.cmake\" will be replaced.  Removing files [${_cmake_old_config_files_text}].")
        unset(_cmake_old_config_files_text)
        file(REMOVE ${_cmake_old_config_files})
      endif()
      unset(_cmake_old_config_files)
    endif()
    unset(_cmake_export_file_changed)
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/CMakeFiles/Export/272ceadb8458515b2ae4b5630a6029cc/obs-websocket-apiTargets.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Development")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/obs-websocket-apiConfig.cmake"
    "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/obs-websocket-apiConfigVersion.cmake"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/Debug/obs-websocket.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/Release/obs-websocket.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/MinSizeRel/obs-websocket.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/RelWithDebInfo/obs-websocket.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/Debug/obs-websocket.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/Release/obs-websocket.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/RelWithDebInfo/obs-websocket.pdb")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/obs-websocket/data" TYPE DIRECTORY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/obs-websocket/data/" USE_SOURCE_PERMISSIONS)
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/obs-websocket/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
