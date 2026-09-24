# Install script for directory: C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/win-capture/graphics-hook

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
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/obs-d3d8-api/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/obs-hook-config/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/win-capture/graphics-hook/obs-vulkan64.json")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/plugins/win-capture/graphics-hook/obs-vulkan32.json")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/Debug/graphics-hook32.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/Release/graphics-hook32.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/MinSizeRel/graphics-hook32.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/RelWithDebInfo/graphics-hook32.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/Debug/graphics-hook32.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/Release/graphics-hook32.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/build_x86/plugins/win-capture/graphics-hook/RelWithDebInfo/graphics-hook32.pdb")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/Debug/graphics-hook64.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/Release/graphics-hook64.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/MinSizeRel/graphics-hook64.dll")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE MODULE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/RelWithDebInfo/graphics-hook64.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/Debug/graphics-hook64.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/Release/graphics-hook64.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/core/win-capture/data" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/RelWithDebInfo/graphics-hook64.pdb")
  endif()
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/plugins/win-capture/graphics-hook/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
