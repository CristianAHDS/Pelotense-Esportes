set(MODULE_NAME "obs-pelotese-assets-controle")
set(MODULE_ID "pelotese-assets-controle")

set(CMAKE_AUTOMOC ON)

add_library(${MODULE_NAME} MODULE
    pelotese-assets-controle.cpp
    browser-panel.hpp
    painel-ponte.hpp)

set_source_files_properties(browser-panel.hpp PROPERTIES SKIP_AUTOMOC TRUE)

target_compile_definitions(${MODULE_NAME} PRIVATE
    MODULE_NAME="${MODULE_NAME}"
    MODULE_ID="${MODULE_ID}"
    MODULE_VERSION="${PROJECT_VERSION}"
    HAVE_OBSCONFIG_H
    UNICODE
    _UNICODE
    NOMINMAX
    WIN32_LEAN_AND_MEAN)

if(MSVC)
    target_compile_options(${MODULE_NAME} PRIVATE /utf-8)
endif()

target_include_directories(${MODULE_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${OBS_STUDIO_SRC}/libobs
    ${OBS_STUDIO_SRC}/frontend/api
    ${OBS_STUDIO_BUILD}/config)

target_link_libraries(${MODULE_NAME} PRIVATE
    Qt6::Widgets
    "${OBS_STUDIO_BUILD}/libobs/Release/obs.lib"
    "${OBS_STUDIO_BUILD}/frontend/api/Release/obs-frontend-api.lib")

set_target_properties(${MODULE_NAME} PROPERTIES
    PREFIX ""
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/obs-plugins/64bit"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/obs-plugins/64bit")

install(TARGETS ${MODULE_NAME}
    RUNTIME DESTINATION "obs-plugins/64bit"
    LIBRARY DESTINATION "obs-plugins/64bit")