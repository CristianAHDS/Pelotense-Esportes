# Install script for directory: C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/frontend

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
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/api/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/json11/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/shared/qt/idian/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/deps/blake2/cmake_install.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for the subdirectory.
  include("C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/updater/cmake_install.cmake")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE EXECUTABLE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/Debug/obs64.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE EXECUTABLE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/Release/obs64.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE EXECUTABLE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/MinSizeRel/obs64.exe")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE EXECUTABLE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/RelWithDebInfo/obs64.exe")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/Debug/obs64.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/Release/obs64.pdb")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE OPTIONAL FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/RelWithDebInfo/obs64.pdb")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libcurl.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avcodec-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avutil-60.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avformat-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swscale-9.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swresample-6.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/zlib.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Cored.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Widgetsd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Guid.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Svgd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Xmld.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Networkd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avdevice-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avfilter-11.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/librist.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/srt.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/datachannel.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libx264-164.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libcurl.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avcodec-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avutil-60.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avformat-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swscale-9.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swresample-6.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/zlib.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Core.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Widgets.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Gui.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Svg.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Xml.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Network.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avdevice-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avfilter-11.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/librist.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/srt.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/datachannel.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libx264-164.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libcurl.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avcodec-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avutil-60.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avformat-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swscale-9.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swresample-6.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/zlib.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Core.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Widgets.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Gui.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Svg.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Xml.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Network.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avdevice-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avfilter-11.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/librist.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/srt.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/datachannel.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libx264-164.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libcurl.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avcodec-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avutil-60.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avformat-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swscale-9.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/swresample-6.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/zlib.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Core.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Widgets.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Gui.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Svg.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Xml.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/bin/Qt6Network.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avdevice-62.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/avfilter-11.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/librist.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/srt.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/datachannel.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-2026-08-26-x64/bin/libx264-164.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/platforms" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qdirect2d.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qdirect2dd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qminimald.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qwindowsd.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo]|[Rr][Ee][Ll][Ee][Aa][Ss][Ee]|[Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/platforms" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qminimal.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/platforms/qwindows.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/styles" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/styles/qmodernwindowsstyled.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo]|[Rr][Ee][Ll][Ee][Aa][Ss][Ee]|[Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/styles" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/styles/qmodernwindowsstyle.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/imageformats" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qgifd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qicnsd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qicod.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qjpegd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qsvgd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qtgad.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qtiffd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qwbmpd.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qwebpd.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo]|[Rr][Ee][Ll][Ee][Aa][Ss][Ee]|[Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/imageformats" TYPE FILE FILES
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qgif.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qicns.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qico.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qjpeg.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qsvg.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qtga.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qtiff.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qwbmp.dll"
      "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/imageformats/qwebp.dll"
      )
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/iconengines" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/iconengines/qsvgicond.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo]|[Rr][Ee][Ll][Ee][Aa][Ss][Ee]|[Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin/64bit/iconengines" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/.deps/obs-deps-qt6-2026-08-26-x64/plugins/iconengines/qsvgicon.dll")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/data/obs-studio/authors" TYPE FILE FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/frontend/../AUTHORS")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Runtime" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/data/obs-studio" TYPE DIRECTORY FILES "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-studio/frontend/data/" USE_SOURCE_PERMISSIONS)
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/tsicr/OneDrive/Área de Trabalho/Pelotense-Esportes/obs-build/frontend/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
