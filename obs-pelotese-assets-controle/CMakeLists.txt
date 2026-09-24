cmake_minimum_required(VERSION 3.16)

project(obs-pelotese-assets-controle VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(OBS_STUDIO_SRC "${PROJECT_SOURCE_DIR}/../obs-studio" CACHE PATH
    "Fonte do obs-studio (libobs/obs-frontend-api)")
set(OBS_STUDIO_BUILD "${PROJECT_SOURCE_DIR}/../obs-build" CACHE PATH
    "Diretorio de build do obs-studio")

find_package(Qt6 COMPONENTS Widgets REQUIRED)

add_subdirectory(src)

install(DIRECTORY data/
    DESTINATION "obs-plugins/data/obs-pelotese-assets-controle")