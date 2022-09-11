"use strict";
var common_vendor = require("../../common/vendor.js");
var store_index = require("../../store/index.js");
var api_bus = require("../../api/bus.js");
require("../../store/modules/music.js");
require("../../store/modules/user.js");
const _sfc_main = {
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc"
    });
    const user = store_index.useUser();
    const infos = common_vendor.reactive({
      name: "",
      account: "",
      desc: "",
      pic_src: ""
    });
    const change = function(type) {
      common_vendor.index.navigateTo({
        url: `/pages/upload/change?type=${type}&value=${infos[type]}`,
        fail: (err) => console.log(err)
      });
    };
    const logout = function() {
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u767B\u51FA\u8D26\u53F7",
        success(res) {
          if (res.confirm) {
            api_bus.Bus.emit("close");
            wx.removeStorageSync("token");
            common_vendor.index.navigateTo({
              url: `/pages/login/index`,
              fail: (err) => console.log(err)
            });
          } else if (res.cancel) {
            console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
          }
        }
      });
    };
    const show_picture = function() {
      db.collection("users").get({
        account: user.account
      }).then((res) => {
        let index = res.data.findIndex((i) => user.account === i.account);
        const { fileId } = res.data[index];
        wx.cloud.getTempFileURL({
          fileList: [
            {
              fileID: fileId,
              maxAge: 60 * 60
            }
          ]
        }).then((res2) => {
          const { tempFileURL } = res2.fileList[0];
          wx.previewImage({
            current: tempFileURL,
            urls: [tempFileURL]
          });
        });
      });
    };
    const click_block = function() {
      let data = new Date().getTime() + "";
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        sizeType: ["compressed"],
        maxDuration: 30,
        camera: "back",
        success(res) {
          console.log(2, res.tempFiles[0].size);
          wx.cloud.uploadFile({
            cloudPath: `users_img/${user.account + data}`,
            filePath: res.tempFiles[0].tempFilePath
          }).then((res2) => {
            let previous_fileId = user.fileId;
            wx.cloud.getTempFileURL({
              fileList: [
                {
                  fileID: res2.fileID,
                  maxAge: 60 * 60
                }
              ]
            }).then((res22) => {
              const { tempFileURL } = res22.fileList[0];
              infos.pic_src = "";
              user.pic_src = "";
              user.pic_src = tempFileURL;
              user.fileId = res2.fileID;
              db.collection("users").where({ account: user.account }).update({
                data: {
                  pic_src: tempFileURL,
                  fileId: res2.fileID
                },
                success: function(res3) {
                  if (previous_fileId !== "cloud://cloud1-9gwoav2d1358e3bc.636c-cloud1-9gwoav2d1358e3bc-1312093740/users_img/logo.png") {
                    wx.cloud.deleteFile({
                      fileList: [previous_fileId]
                    }).then((res4) => {
                      console.log("res4", res4.fileList);
                    }).catch((error) => {
                    });
                  }
                }
              });
            });
          }).catch((error) => {
            console.log(error.message);
          });
        }
      });
    };
    common_vendor.watch(() => user.name, (newVal) => {
      infos.name = newVal;
    }, {
      immediate: true
    });
    common_vendor.watch(() => user.desc, (newVal) => {
      infos.desc = newVal;
    }, {
      immediate: true
    });
    common_vendor.watch(() => user.account, (newVal) => {
      infos.account = newVal;
    }, {
      immediate: true
    });
    common_vendor.watch(() => user.pic_src, (newVal) => {
      console.log("pic", newVal);
      infos.pic_src = newVal;
    }, {
      immediate: true
    });
    return {
      change,
      infos,
      logout,
      click_block,
      show_picture
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.infos.pic_src,
    b: common_vendor.o((...args) => $setup.show_picture && $setup.show_picture(...args)),
    c: common_vendor.o((...args) => $setup.click_block && $setup.click_block(...args)),
    d: common_vendor.t($setup.infos.account),
    e: common_vendor.t($setup.infos.name),
    f: common_vendor.o(($event) => $setup.change("name")),
    g: common_vendor.t($setup.infos.desc),
    h: common_vendor.o(($event) => $setup.change("desc")),
    i: common_vendor.o((...args) => $setup.logout && $setup.logout(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb0c3870"], ["__file", "S:/final_mad/src/pages/upload/index.vue"]]);
wx.createPage(MiniProgramPage);
