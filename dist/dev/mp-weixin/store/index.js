"use strict";
var store_modules_music = require("./modules/music.js");
var store_modules_user = require("./modules/user.js");
const useMusic = store_modules_music.music;
const useUser = store_modules_user.user;
exports.useMusic = useMusic;
exports.useUser = useUser;
