/******************************************************************************
    Copyright (C) 2026 by FiniteSingularity <finitesingularityttv@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
******************************************************************************/

#include <string.h>
#include <obs-core-modules.h>

const char *obs_core_modules[] = {
	"aja",
	"aja-output-ui",
	"coreaudio-encoder",
	"decklink",
	"decklink-captions",
	"decklink-output-ui",
	"frontend-tools",
	"image-source",
	"nv-filters",
	"obs-ffmpeg",
	"obs-filters",
	"obs-nvenc",
	"obs-outputs",
	"obs-qsv11",
	"obs-text",
	"obs-transitions",
	"obs-vst",
	"obs-webrtc",
	"obs-websocket",
	"obs-x264",
	"rtmp-services",
	"text-freetype2",
	"vlc-video",
	"win-capture",
	"win-dshow",
	"win-wasapi"
};

const unsigned int obs_core_modules_count = 26;

bool obs_in_core_module_list(const char *name) {
	for (unsigned int i = 0; i < obs_core_modules_count; i++) {
		if(strcmp(obs_core_modules[i], name) == 0) {
			return true;
		}
	}
	return false;
}
