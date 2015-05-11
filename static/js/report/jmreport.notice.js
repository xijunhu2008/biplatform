/*
*公告处理器
*/
jmreport.notice = function () {
    var self = this;
    this.notice = {
        contents: [],
        buttons: [],
        intervalIndex: 0,
        intervalDelay: 5000,
        init: function (data) {
            clearInterval(jmreport.noticeInterval);
            jmreport.noticeInterval = null;
            //创建数据容器
            this.contents = [];
            this.buttons = [];
            for (var i = 0; i < data.length; i++) {
                var tempPoint = "";
                if (i == 0) {
                    tempPoint = 'class="alt-point"';
                }
                this.contents.push($("<li content-index='" + i + "' ><a target='_blank' href=" + data[i].Url + " >" + data[i].Title + "</a></li>"));
                this.buttons.push($('<li ' + tempPoint + ' button-index="' + i + '"  ></li>'));
            }

            //将内容放置到页面上去
            this.appendItems();

            //设置定时切换跑马灯
            this.runNotice();

            //给跑马灯绑定事件
            this.bindEvents();
        },
        appendItems: function () {
            //获取控件容器
            var noticeContent = $(self.noticeContainer).find('.notice-right-content');
            var buttonContent = $(self.noticeContainer).find('.little-point');
            noticeContent.empty();
            buttonContent.empty();
            // 循环将内容放置入页面之中
            for (var i = 0; i < this.contents.length; i++) {
                this.contents[i].appendTo(noticeContent);
                this.buttons[i].appendTo(buttonContent);
            }
        },
        runNotice: function () {
            var self = this;
            var tempRun = function () {
                self.runFunction.call(self);
            }
            jmreport.noticeInterval = setInterval(tempRun, this.intervalDelay);
        },
        runFunction: function () {
            if (this.intervalIndex > this.contents.length - 1) {
                this.intervalIndex = 0;
            }
            var noticeContent = $(self.noticeContainer).find('.notice-right-content');

            noticeContent.animate({ "top": 0 - this.intervalIndex * 40 }, 500);

            for (i in this.buttons) {
                this.buttons[i].removeAttr('class');
            }
            this.buttons[this.intervalIndex].attr('class', 'alt-point');

            this.intervalIndex++;
        },
        bindEvents: function () {
            var that = this;
            //内容
            for (var i in this.contents) {
                //鼠标放在内容上时
                this.contents[i].mouseover(function () { clearInterval(jmreport.noticeInterval); });
                //鼠标移出内容上时
                this.contents[i].mouseout(function () { that.runNotice(); });
            }

            //小图标
            for (i in this.buttons) {

                //鼠标移动上小图标
                this.buttons[i].mouseover(function () {
                    clearInterval(jmreport.noticeInterval);
                    for (i in that.buttons) {
                        that.buttons[i].removeAttr('class');
                    }
                    $(this).attr('class', 'alt-point');

                    var noticeContent = $(self.noticeContainer).find('.notice-right-content');
                    noticeContent.stop();
                    noticeContent.animate({ "top": 0 - Number($(this).attr('button-index')) * 40 }, 500);
                });

                //鼠标离开小图标
                this.buttons[i].mouseout(function () {
                    that.runNotice();
                });
            }
            //隐藏公告
            $("#jmreport-page-notice-hide").click(function () {
                $("#jmreport-page-notice").slideUp(300);
            });
        }
    }
}