/*
*邮件系统处理器
*/
jmreport.mail = function () {
    var self = this;
    this.mail = {
        state: 'loading',
        //所有收藏夹
        collectionData: [],
        //当前所选收藏夹下的子项目
        collectionItemData: [],
        //收藏夹是否为显示状态
        isDisplay: false,
        //当前选中的收藏夹对象
        nowCollection: null,
        //本产品是否为第一次加载收藏夹
        isFristLoad: true,
        //删除图表时，所缓存的列表
        deleteChartsCache: [],
        //init将初始化所有邮
        //件操作相关的结构，
        //并初次拉取数据
        init: function () {
            //在第一次载入之前，将上次可能没有清理的删除项目删掉
            this.deleteChartsFromCookie();
            //将收藏按钮加入进页面
            self.collectionContent = $('<div class="collection" ></div>');
            self.collectionContiner = $('<div class="page-collection-continer" ></div>').appendTo(self.collectionContent);

            this.iconText = $('<span class="text">图表收藏夹</span>').appendTo(self.collectionContiner);
            //加入图标
            this.icon = $('<div class="collectionIcon close" title="我的收藏夹" ></div>').appendTo(self.collectionContiner);

            //加入title
            this.title = $('<span class="page-collection-title"></span> ').appendTo(self.collectionContiner);
            //加入列表continer
            this.listContiner = $('<div class="listLayer"></div>').appendTo(self.collectionContiner);

            //创建结构：创建列表内容
            this.createListContiner();

            var _that = this;
            //第一次载入，先获得所有的收藏夹
            jmreport.proxy.report.getUserStore(function (data, e) {
                //大于0就去绑定数据
                if (data.length > 0) {
                    //请求完数据后执行的方法
                    _that.bindCollectionData(data);
                    _that.isFristLoad = false;
                } else {
                    //制造一条假数据
                    _that.dummyCollectionData();
                }
                //不论如何都要绑定方法
                _that.bindEvent();
                //将当前收藏夹对象的状态设为ready
                _that.state = 'ready';
            });
        }
        ,
        dummyCollectionData: function () {
            //向selecter中加入数据
            this.collectionSelecter.append('<option selected="selected" id="dummy" value="dummy" >未命名</option>');
            //提示用户没有数据
            this.createNullDataHtml();
        },
        //绑定收藏夹数据
        bindCollectionData: function (data) {
            this.collectionData = data;
            this.collectionSelecter = undefined;
            this.collectionSelecterCon.empty();
            this.collectionSelecter = $("<select id='jmreport-mail-collectionSelecter' ></select>").appendTo(this.collectionSelecterCon);
            //创建收藏夹切换时的事件
            var that = this;
            this.collectionSelecter.change(function () {
                that.cSelecterChange.call(that, $(this).val());
            });
            for (var i = 0; i < data.length; i++) {
                var selected = '';
                if (i == 0) {
                    selected = 'selected="selected"';
                    this.nowCollection = data[i];
                }
                //向selecter中加入数据
                this.collectionSelecter.append('<option ' + selected + ' id="' + data[i].ID + '" value="' + data[i].ID + '" >' + data[i].ReportName + '</option>');
            }
            //获得当前的收藏夹下的列表
            this.getCollectionList(this.nowCollection);
        },
        //绑定收藏夹的项目列表
        bindCollectionItemData: function (data) {
            data = data.sort(function (a, b) {
                return Number(b.seq) - Number(a.seq);
            });
            //对比出新的项目是什么
            if (this.collectionItemData.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    var same = false;
                    for (var j = 0; j < this.collectionItemData.length; j++) {
                        if (data[i].ID == this.collectionItemData[j].ID) {
                            same = true;
                        }
                    }
                    if (!same) { data[i]['isNew'] = true; }
                }
            }
            this.chartList.empty();
            this.collectionItemData = data;
            //显示收藏夹中的数量
            //this.icon.html(this.collectionItemData.length);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    this.createCollectionItem(data[i], i);
                }
            } else {
                //没有数据就提示用户
                this.createNullDataHtml();
            }
        }
        ,
        //生成列表项目
        createCollectionItem: function (item, i) {
            var cssStyle = "";
            if (i % 2) {
                cssStyle = " alt-row";
            }
            var newStr = '';
            if (item.isNew) {
                newStr = '<span class="left new" >New</span>';
            }

            //查找是否有被缓存住的删除项目
            var isDisplay = "";
            if (this.deleteChartsCache.length > 0) {
                for (var i = 0; i < this.deleteChartsCache.length; i++) {
                    if (this.deleteChartsCache[i].id == item.ID) {
                        isDisplay = "style='display:none' "
                    }
                }
            }

            var itemHtml = $('<div class="item' + cssStyle + '" ' + isDisplay + ' id="jmreport-col-item-' + item.ID + '" >' +
            '      <div class="item-bigTitle" >' +
            '          <img class="right" src="' + oap.rootUrl + 'Content/themes/base/Images/close.png" data-id="delete" data-item-value="' + item.ID + '" title="移除" />' +
            '          <img class="right" src="' + oap.rootUrl + 'Content/themes/base/Images/zoom-in.png" data-id="detail" data-item-value="' + item.ID + '" title="预览" />' +
            '          <input class="left" type="text" value="' + item.userTitle + '" />' +
                       newStr +
            '      </div>' +
            '      <div class="item-smallTitle" >' + item.Name + '</div>' +
            ' </div>').appendTo(this.chartList);

            //绑定事件
            (function (itemHtml, item, _this) { _this.bindItemEvent(itemHtml, item, _this); })(itemHtml, item, this);
        },
        //收藏项事件绑定
        bindItemEvent: function (itemHtml, itemObj, that) {
            //快速编辑名称
            $(itemHtml).find('input[type=text]').focus(function () {
                $(this).attr('class', 'left modify');
                $(this).attr('title', '修改后点击别处即可变更!');
                $(this).blur(function () {
                    $(this).unbind('blur');
                    //更新数据
                    var titleText = $.trim($(this).val());
                    if ($.trim(titleText) == '' || titleText == itemObj.userTitle) {
                        $(this).attr('class', 'left');
                        $(this).val(itemObj.userTitle);
                    } else {
                        var tempTitle = itemObj.userTitle;
                        if (titleText) {
                            itemObj.userTitle = titleText;
                        }
                        var _that = this;
                        jmreport.proxy.report.updateReportTitle(itemObj.ID, itemObj.userTitle, function (data) {
                            if (data != 0) {
                                $(_that).attr('class', 'left');
                            } else {
                                $(this).attr('class', 'left');
                                itemObj.userTitle = tempTitle;
                                $(this).val(tempTitle);
                            }
                        });
                    }
                });
            });

            //鼠标浮动样式 删除
            $(itemHtml).find('img[data-id=delete]').mouseover(function () {
                $(this).attr('src', oap.rootUrl + "Content/themes/base/Images/close-cur.png");
                $(this).mouseout(function () {
                    $(this).unbind('mouseout');
                    $(this).attr('src', oap.rootUrl + "Content/themes/base/Images/close.png");
                });
            });

            //鼠标浮动样式 查看
            $(itemHtml).find('img[data-id=detail]').mouseover(function () {
                $(this).attr('src', oap.rootUrl + "Content/themes/base/Images/zoom-in-cur.png");
                $(this).mouseout(function () {
                    $(this).unbind('mouseout');
                    $(this).attr('src', oap.rootUrl + "Content/themes/base/Images/zoom-in.png");
                });
            });

            //删除收藏项目
            $(itemHtml).find('img[data-id=delete]').click(function () {
                //此为新版删除，此代码块先将要删除的图表缓存于数组中，待收藏夹关闭便操作数据库删除
                itemHtml.slideUp(200);
                that.deleteChartsCache.push({ id: $(this).attr('data-item-value') });
                that.deletedResetBut.html('已删除&nbsp;' + that.deleteChartsCache.length + '&nbsp;图表<a style="cursor:pointer" >恢复</a>');
                that.deletedResetBut.unbind('click');
                that.deletedResetBut.click(function () {
                    for (var i = 0; i < that.deleteChartsCache.length; i++) {
                        $("#jmreport-col-item-" + that.deleteChartsCache[i].id).slideDown(200);
                    }
                    that.deleteChartsCache = [];
                    //清空的话就连cookie也删掉
                    oap.cookie.delCookie('deleteChartsCache');
                    that.deletedResetBut.unbind('click');
                    that.deletedResetBut.html('');
                });

                //在cookie中保存一个列表
                //1.检查是否存在相同的cookie
                var tempCache = oap.cookie.getCookie('deleteChartsCache');
                if (typeof (tempCache) != "undefined" && tempCache != null) {
                    //2.有的话直接销毁
                    oap.cookie.delCookie('deleteChartsCache');
                }
                //3.无论如何将现有的cookie放进去
                oap.cookie.addCookie('deleteChartsCache', JSON.stringify(that.deleteChartsCache), 30 * 24);
            });
            //预览收藏项目
            $(itemHtml).find('img[data-id=detail]').click(function () {
                //alert("查看明细-" + $(this).attr('data-item-value'));
                if (!itemObj.ProductionID) {
                    itemObj.ProductionID = that.nowCollection.ProductionID;
                }
                window.reviewData = itemObj;

                var popPage = $('<div class="jmreport-poppage"></div>').attr('style', 'margin:0px;padding:0px;padding:0px;height:auto;overflow:hidden');
                that.titleContent = $('<div class="modify-collectionItem-title" ></div>').appendTo(popPage);
                var titleInput = $('<input type="text" onMouseUp="this.select()" />').appendTo(that.titleContent);
                that.rLoading = $('<div style="width:100%;text-align:center" ><img src="' + oap.rootUrl + 'Content/themes/base/Images/loading.gif" style="margin:0px auto 0px auto" /><div>').appendTo(popPage);
                that.iframe = $('<iframe style="width:100%;height:450px;display:none" ></iframe>').appendTo(popPage);
                that.discriptionContent = $('<div class="modify-discriptionContent" ></div>').appendTo(popPage);
                var textDiscriptionContent = $('<textarea placeholder="图表注释" ></textarea>').appendTo(that.discriptionContent);
                that.footerOption = $('<div class="modify-options" ><ul>' +
                                     '   <li class="saveli" ><input type="button" class="saveButton" value="保存" /></li>' +
                                     '   <li class="optionli" style="display:none" ><input type="checkbox" class="orginal-chart" /></li><li style="display:none" >正常图表格式</li>' +
                                     '   <li class="optionli" style="display:none" ><input type="checkbox"  class="data-chart"  /></li><li style="display:none" >数据附件格式</li>' +
                                     '   </ul></div>');
                //保存收藏项目按钮
                that.saveCollectionbtn = that.footerOption.find('.saveButton');
                //正常图表格式
                that.orginalChart = that.footerOption.find('.orginal-chart');
                //数据附件格式
                that.dataChart = that.footerOption.find('.data-chart');
                //在这里同步domain
                var domainStr = '';
                if (getUrlParams()['setDomain']) {
                    domainStr = "?setDomain=" + window.document.domain;
                }
                that.iframe.attr('src', oap.rootUrl + "Home/reviewChart" + domainStr);
                self.openSingleModal({
                    height: 'auto',
                    width: '800',
                    title: '图表预览-' + itemObj.Name,
                    pageModal: popPage,
                    position: {x:'center',y:'top'}
                });

                //赋值
                titleInput.val(itemObj.userTitle);
                textDiscriptionContent.val(itemObj.CommentInfo);

                //更改title
                titleInput.focus(function () {
                    $(this).attr('class', 'cur');
                    $(this).blur(function () {
                        $(this).unbind('blur');
                        $(this).attr('class', '');

                        //更新数据
                        var titleText = $.trim($(this).val());
                        if ($.trim(titleText) == '' || titleText == itemObj.userTitle) {
                            $(this).attr('class', 'left');
                            $(this).val(itemObj.userTitle);
                        } else {
                            var tempTitle = itemObj.userTitle;
                            if (titleText) {
                                itemObj.userTitle = titleText;
                            }
                            var _that = this;
                            jmreport.proxy.report.updateReportTitle(itemObj.ID, itemObj.userTitle, function (data) {
                                if (data != 0) {
                                    that.getCollectionList(that.nowCollection);
                                }
                            });
                        }
                    });
                });
                //更改discription
                textDiscriptionContent.focus(function () {
                    $(this).attr('class', 'cur');
                    $(this).blur(function () {
                        $(this).unbind('blur');
                        $(this).attr('class', '');

                        //更新数据
                        var commentInfo = $.trim($(this).val());
                        if ($.trim(commentInfo) == '' || commentInfo == itemObj.CommentInfo) {
                            $(this).attr('class', 'left');
                            $(this).val(itemObj.CommentInfo);
                        } else {
                            var tempCommentInfo = itemObj.CommentInfo;
                            if (commentInfo) {
                                itemObj.CommentInfo = commentInfo;
                            }
                            var _that = this;
                            var inputData = "";
                            for (var i = 0; i < that.collectionItemData.length; i++) {
                                if (inputData == "") {
                                    inputData = JSON.stringify(that.collectionItemData[i]);
                                } else {
                                    inputData += ";" + JSON.stringify(that.collectionItemData[i]);
                                }
                            }

                            //更新
                            jmreport.proxy.report.updateCommentInfo(inputData, function (data) {
                                if (data != 0) {
                                    that.getCollectionList(that.nowCollection);
                                }
                            });
                        }
                    });
                });

                //定义一个函数，使子页面的函数可以调用
                //更新工具栏参数
                var upInterval;
                that.updateReportDetailToolbarParmars = function (thatButton) {
                    clearInterval(upInterval);
                    $(thatButton).attr("disabled", 'disabled');
                    $(thatButton).html("保存中");
                    upInterval = setInterval(function () {
                        if ($(thatButton).html() == "保存中") {
                            $(thatButton).html("保存中.");
                            return;
                        }
                        if ($(thatButton).html() == "保存中.") {
                            $(thatButton).html("保存中..");
                            return;
                        }
                        if ($(thatButton).html() == "保存中..") {
                            $(thatButton).html("保存中");
                            return;
                        }
                    }, 100);
                    //新增字段 当前收藏报表的工具栏参数
                    itemObj.ToolBarPars = JSON.stringify(jmreport.currentPage.mail.iframe[0].contentWindow.jmreport.currentPage.getReViewParams());

                    var inputData = "";
                    for (var i = 0; i < that.collectionItemData.length; i++) {
                        if (inputData == "") {
                            inputData = JSON.stringify(that.collectionItemData[i]);
                        } else {
                            inputData += ";" + JSON.stringify(that.collectionItemData[i]);
                        }
                    }
                    //更新工具栏参数
                    jmreport.proxy.report.updateReportDetailToolbarParmars(inputData, function (data) {
                        //更新后解除状态
                        clearInterval(upInterval);
                        $(thatButton).html('保存参数');
                        $(thatButton).removeAttr("disabled");
                        if (data != 0) {
                            that.getCollectionList(that.nowCollection);
                        }
                    });
                }

            });
        },
        //从删除缓存中删除之前删除的图表项目
        deleteChartsFromCache: function () {
            if (this.deleteChartsCache.length == 0) { return; }
            for (var i = 0; i < this.deleteChartsCache.length; i++) {
                (function (that, id) {
                    that.deleteCollectionItem(id, function () {
                        $("#jmreport-col-item-" + id).remove();
                        if (that.chartList.html() == '') {
                            that.createNullDataHtml();
                        }
                    });
                })(this, this.deleteChartsCache[i].id);
            }
            this.deleteChartsCache = [];
            //清空的话就连cookie也删掉
            oap.cookie.delCookie('deleteChartsCache');
            if (this.deletedResetBut) {
                this.deletedResetBut.unbind('click');
                this.deletedResetBut.html('');
            }
        },
        //从cookie缓存的“图表删除缓存”中，将图表删除
        deleteChartsFromCookie: function () {
            var tempCache = oap.cookie.getCookie('deleteChartsCache');
            //如果cookie中存在未删除的图表,就将这些图表放入this.deleteChartsCache
            if (typeof (tempCache) != "undefined" && tempCache != null) {
                this.deleteChartsCache = JSON.parse(tempCache);
                this.deleteChartsFromCache();
            }
        },
        //创建列表内容
        createListContiner: function () {
            /*选择收藏夹*/
            //构造基本结构
            this.collections = $("<ul class='collections' ></ul>");
            $("<li class='item' ><span class='title' >选择收藏夹</span></li>").appendTo(this.collections);
            //构造收藏夹
            this.collectionSelecterCon = $("<li class='item' id='jmreport-mail-collectionSelecter-content' ></li>").appendTo(this.collections)
            this.collectionSelecter = $("<select id='jmreport-mail-collectionSelecter' ></select>").appendTo(this.collectionSelecterCon);
            //创造“修改收藏夹名称”连接
            this.modifyCollBut = $("<a class='modifyCollBut' title='修改' ></a>").appendTo($("<li class='item' ></li>").appendTo(this.collections));
            //构造“创建收藏夹”连接
            this.createCollBut = $("<a class='createCollBut' title='新增' ></a>").appendTo($("<li class='item' ></li>").appendTo(this.collections));
            //将“收藏夹”加入至this.listContiner中
            this.collections.appendTo(this.listContiner);


            /*收藏夹名称*/
            //构造基本结构
            this.addCollections = $("<ul class='collections' id='createCollection' ></ul>");
            this.collectionCreateTitle = $("<li class='item' ><span class='title' >新增收藏夹</span></li>").appendTo(this.addCollections);
            //构造收藏夹
            this.collectionCreateInput = $("<input type='input'/>").appendTo($("<li class='item' ></li>").appendTo(this.addCollections));
            //构造“确定”按钮
            this.sureCCBut = $("<a>确定</a>").appendTo($("<li class='item' ></li>").appendTo(this.addCollections));
            //将“创建收藏夹”加入至this.listContiner中
            this.addCollections.appendTo(this.listContiner);

            /*设置定时任务按钮*/
            this.setTimeOutTeskBut = $('<div class="jmreport-setTimeOutTesk-but">设置定时分享（邮件）</div>').appendTo(this.listContiner);

            /*关闭按钮*/
            //构造列表并加入至this.listContiner中
            this.chartList = $('<div class="jmreport-collections-chartList"></div>').appendTo(this.listContiner);
            //构造关闭按钮
            this.closeButton = $('<a class="jmreport-collections-closeBut">关闭</a>').appendTo(this.listContiner);
            //构造删除图表恢复按钮
            this.deletedResetBut = $('<span class="jmreport-collections-deleted" ></span>').appendTo(this.listContiner);
        },
        //木有数据
        createNullDataHtml: function () {
            this.chartList.html("<div class='jmreport-collections-List-null' >当前收藏夹为空，可点击图表右上方 <img src='" + oap.rootUrl + "Content/themes/base/Images/addIcon.png' /> 开始收藏。</div>");
        },
        //播放一个动画，表示报表加载成功！
        successAdded: function (chartName, collectionName) {
            var animationItem = $("<div class='jmreport-animationItem-suAdded' >" +
                                  "<p>已添加到收藏夹，可编辑定时任务:" +
                                  "<p>邮件：<img  src='" + oap.rootUrl + "Content/themes/base/Images/wechart-mail-icon.png' />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信：<img src='" + oap.rootUrl + "Content/themes/base/Images/send-mail-icon.png' /></p>" +
                                  "</div>").appendTo('body');
            animationItem.css("top", ($(window).height() / 2 - animationItem.height() / 2) + $(document).scrollTop() + 'px');
            animationItem.css("left", $(window).width() / 2 - animationItem.width() / 2 + 'px');
            var that = this;
            animationItem.animate({ top: animationItem.position().top - 100, opacity: 1 }, 2000, function () {
                var coll = $('.page-collection-continer');
                animationItem.animate({ top: coll.position().top, left: coll.position().left, width: 50, height: 4 }, 500, function () {
                    animationItem.fadeOut(200, function () {
                        $(this).remove();
                    });
                });
                if (!that.isDisplay) {
                    that.iconClick.call(that);
                }
            });
        },
        //设置页面上所有“添加到收藏夹”按钮的状态
        //state:"on",可以点击
        //state:"off",不可点击
        setPlusButtonState: function (state) {
            $(".content-control-plus").stop();
            if (state == "off") {
                $(".content-control-plus").attr('disable', 'disable');
                $(".content-control-plus").animate({ opacity: 0.3 }, 200);
            } else {
                $(".content-control-plus").removeAttr('disable');
                $(".content-control-plus").animate({ opacity: 1 }, 200);
            }
        },
        //增加一个收藏夹
        addACollection: function (name, callback) {

            var tempfunction = function () {
                //再去请求服务器索取数据
                jmreport.proxy.report.getUserStore(function (data, e) {
                    if (callback) {
                        callback(data);
                    }
                });
            }

            //判断当前的状态是修改还是新增
            if (this.isModifyColl == true) {
                //修改数据
                jmreport.proxy.report.updateReportStoreName(name, this.nowCollection.ID, function () {
                    tempfunction();
                });
            } else {
                //先插入数据
                jmreport.proxy.report.insertStore(name, function () {
                    tempfunction();
                });
            }
        },
        //删除报表项目
        deleteCollectionItem: function (id, callBack) {
            jmreport.proxy.report.deleteDetail(id, function (data) {
                if (data) {
                    callBack();
                }
            });
        },
        //将报表项目加载至当前收藏夹中
        chartAppendToCollection: function (chartObj) {
            //检查当前对象是否为ready状态
            if (this.state == 'loading') { return; }
            var tempFunc = function (chartObj) {
                //找到目前在列表中最大的项目
                var findMaxSeqInCollectionItemData = function () {
                    //如果
                    if (this.collectionItemData.length == 0) {
                        return 1;
                    }
                    var max = Number(this.collectionItemData[0].seq);
                    for (var i = 0; i < this.collectionItemData.length; i++) {
                        var tempNum = Number(this.collectionItemData[i].seq);
                        if (max < tempNum) {
                            max = tempNum;
                        }
                    }
                    return max;
                }
                var data = {};
                data["ID"] = "";

                var regStr = new RegExp("[\:a-zA-Z]", "g");
                var title = chartObj.config.config.Title.replace(regStr, "");
                title = title.replace(new RegExp("[\(\)]", "g"), "");

                /// 名称
                data["Name"] = title;
                /// 用户自定义的名称
                data["userTitle"] = title;
                /// 页面ID
                data["tbdisplaymenupageID"] = jmreport.currentPage.pageId;
                /// 控件ID
                data["tbreportcontrolconfigid"] = chartObj.config.config.Id;
                /// 所属报告ID
                data["tbreportstoreid"] = jmreport.currentPage.mail.nowCollection.ID;

                //获得最大值
                var maxNum = findMaxSeqInCollectionItemData.call(this);
                /// 排序ID
                data["seq"] = maxNum + 1;
                /// 作者对这个报告的评论
                data["CommentInfo"] = "";
                /// 信息链接地址
                data["infourl"] = "";
                /// 报告控件外键ID，默认为空
                data["imageurl"] = "";
                /// 报告控件外键ID，默认为空
                data["tbReportControlConfigRefid"] = "";
                //新增字段 是否被缓存
                // data["IsCached"] = null;
                //新增字段 当前收藏报表的工具栏参数 这个字段是一个字符串型的json
                data["ToolBarPars"] = JSON.stringify(self.getReViewParams());
                //获得控件栏参数
                var pars = self.getReViewParams();

                var that = this;
                //使页面中所有收藏按钮失效
                this.setPlusButtonState('off');
                jmreport.proxy.report.insertDetail(data, pars, function (data) {
                    if (data) {
                        //添加完成后重新拉取列表数据
                        that.getCollectionList(that.nowCollection);
                        //使页面中所有收藏按钮有效
                        that.setPlusButtonState('on');
                        //播放一个完成的动画
                        that.successAdded.call(that, chartObj.config.config.Title, that.nowCollection.ReportName);
                    }
                });
            }
            //如果有数据就直接添加收藏项目
            if (jmreport.currentPage.mail.collectionData.length > 0) {
                tempFunc.call(this, chartObj)
            } //没有数据就先增加一个收藏夹再增加收藏项目
            else {
                //否则就新建一个默认的文件夹
                var _that = this;
                this.addACollection('未命名', function (data) {
                    //请求完数据后执行的方法
                    _that.bindCollectionData(data);
                    _that.isFristLoad = false;
                    //再增加收藏项目
                    tempFunc.call(_that, chartObj)
                });
            }
        },
        //使用一个收藏夹对象获得收藏夹中的列表
        getCollectionList: function (CollectionObj) {
            var that = this;
            //获得该收藏夹下所有的项目
            jmreport.proxy.report.getStoreDetails(CollectionObj.ID, function (data) {
                //绑定收藏夹
                that.bindCollectionItemData(data);
            });
        },
        //展开"添加收藏文件夹"
        showCreateCollection: function (isModifyColl) {

            var tempFunc = function (isModifyColl) {
                this.isModifyColl = isModifyColl;
                if (this.isModifyColl) {
                    this.collectionCreateTitle.find('.title').html("修改名称");
                    this.collectionCreateInput.val(this.nowCollection.ReportName);
                } else {
                    this.collectionCreateTitle.find('.title').html("新增收藏夹");
                    this.collectionCreateInput.val("");
                }

                this.collections.stop();
                this.chartList.stop();
                this.addCollections.stop();

                this.collections.slideUp(200);
                this.chartList.slideUp(200);
                this.setTimeOutTeskBut.slideUp(200);
                this.addCollections.slideDown(200);

                var that = this;
                this.closeButton.html("返回");
                this.closeButton.unbind('click');
                this.closeButton.click(function () {
                    that.hideCreateCollection();
                });
                $(this.collectionCreateInput).mouseup();
            }
            //如果有数据就直接执行方法
            if (jmreport.currentPage.mail.collectionData.length > 0) {
                tempFunc.call(this, isModifyColl)
            } //没有数据就先增加一个收藏夹再增加收藏项目
            else {
                //否则就新建一个默认的文件夹
                var _that = this;
                //新增开关
                _that.isModifyColl = false;
                this.addACollection('未命名', function (data) {
                    //请求完数据后执行的方法
                    _that.bindCollectionData(data);
                    _that.isFristLoad = false;
                    //再执行方法
                    tempFunc.call(_that, isModifyColl)
                });
            }
        }
        ,
        //关闭"添加收藏文件夹"
        hideCreateCollection: function () {
            this.collections.stop();
            this.chartList.stop();
            this.addCollections.stop();

            this.collections.slideDown(200);
            this.chartList.slideDown(200);
            this.setTimeOutTeskBut.slideDown(200);
            this.addCollections.slideUp(200);
            //关闭按钮
            var that = this;
            this.closeButton.html("关闭");
            this.closeButton.unbind('click');
            this.closeButton.click(function () {
                that.hideList();
                that.isDisplay = false;
            });
        }
        ,
        //将列表显示出来
        showList: function () {
            var that = this;

            self.collectionContiner.stop();
            that.title.stop();
            that.listContiner.stop();
            self.collectionContiner.css('overflow', '');
            this.icon.attr('class', 'collectionIcon open');

            self.collectionContiner.animate({ "width": 387, "margin-left": -247 }, 500, function () {
                that.title.fadeIn(200);

                var listContinerHeight = that.listContiner.css('display', 'block').height();
                that.listContiner.height(0);
                that.listContiner.animate({ "height": listContinerHeight, opacity: 'show' }, 500, function () {
                    that.listContiner.css('height', '');
                });
            });
        }
        ,
        //将列表隐藏
        hideList: function () {
            //清除删除的图表
            this.deleteChartsFromCache();

            var that = this;

            self.collectionContiner.stop();
            that.title.stop();
            that.listContiner.stop();
            self.collectionContiner.css('overflow', '');
            this.icon.attr('class', 'collectionIcon close');


            that.title.fadeOut(200);
            that.listContiner.fadeOut(200, function () {
                self.collectionContiner.animate({ "width": 140, "margin-left": 0 }, 500);
            });
        }
        ,
        //icon按钮被点击的时候
        iconClick: function () {
            if (this.isDisplay) {
                this.hideList();
                this.isDisplay = false;
            } else {
                this.showList();
                this.isDisplay = true;
            }
        },
        //确定添加收藏夹按钮按下的事件
        sureCCButClick: function () {
            if ($.trim(this.collectionCreateInput.val()) != '') {
                //与服务器通讯，增加收藏夹
                var that = this;
                this.addACollection(this.collectionCreateInput.val(), function (data) {
                    that.collectionCreateInput.val('');
                    that.hideCreateCollection();
                    that.bindCollectionData(data);
                })
            } else {
                alert('未填写收藏夹名称！');
            }
        },
        //收藏夹切换时的事件
        cSelecterChange: function (value) {
            this.nowCollection = this.findCByid(value);

            this.getCollectionList(this.nowCollection);
        },
        //试用id找到收藏夹
        findCByid: function (id) {
            for (var i = 0; i < this.collectionData.length; i++) {
                if (this.collectionData[i].ID == id) {
                    return this.collectionData[i];
                }
            }
            return null;
        },
        //打开定时任务设置
        setTimeOutTeskOpen: function () {
            if (this.nowCollection) {
                //window.open(oap.rootUrl + "reportstore/EditFavorite?rid=" + this.nowCollection.ID + "&pid=" + oap.app.ID);
                window.open(oap.rootUrl + "reportstore/MyFavorites?rid=" + this.nowCollection.ID + "&pid=" + oap.app.ID);
            }
        },
        //事件绑定
        bindEvent: function () {
            var that = this;
            //绑定列表展开或收起 
            this.icon.click(function () { that.iconClick.call(that); });
            //绑定列表展开或收起 
            this.iconText.click(function () { that.iconClick.call(that); });
            //关闭按钮
            this.closeButton.click(function () {
                that.hideList();
                that.isDisplay = false;
            });
            //创建收藏夹按钮
            this.createCollBut.click(function () {
                that.showCreateCollection(false);
            });
            //修改收藏夹名称
            this.modifyCollBut.click(function () {
                that.showCreateCollection(true);
            });
            //创建收藏夹的确定按钮
            this.sureCCBut.click(function () {
                that.sureCCButClick.call(that);
            });
            //创建收藏夹切换时的事件
            this.collectionSelecter.change(function () {
                that.cSelecterChange.call(that, $(this).val());
            });
            //定时任务设置
            this.setTimeOutTeskBut.click(function () {
                //如果有数据就直接执行方法
                if (jmreport.currentPage.mail.collectionData.length > 0) {
                    that.setTimeOutTeskOpen();
                } //没有数据就先增加一个收藏夹再增加收藏项目
                else {
                    //否则就新建一个默认的文件夹
                    that.addACollection('未命名', function (data) {
                        //请求完数据后执行的方法
                        that.bindCollectionData(data);
                        that.isFristLoad = false;
                        //再执行方法
                        that.setTimeOutTeskOpen();
                    });
                }
            });
        }

    }
} 

