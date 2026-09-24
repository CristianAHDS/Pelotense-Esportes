# Install script for directory: C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/rtmp-services

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
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/shared/file-updater/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/Debug/rtmp-services.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/Release/rtmp-services.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/MinSizeRel/rtmp-services.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/RelWithDebInfo/rtmp-services.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/Debug/rtmp-services.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/Release/rtmp-services.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/RelWithDebInfo/rtmp-services.pdb")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/rtmp-services/data" TYPE DIRECTORY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/rtmp-services/data/" USE_SOURCE_PERMISSIONS)
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/rtmp-services/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
