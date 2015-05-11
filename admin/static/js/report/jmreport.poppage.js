/*
*透视图专用对象
*/
jmreport.poppage = function () {
    var self = this;

    /*
    *透视控制器
    */
    this.poppageControl = {
        openedUi: [],
        openedFrame: [],
        nowFrame: null,
        treeContent: "#jmreport-poppage-tree-content",
        frameContent: "#jmreport-poppage-frame-content",
        modalWindow: null,
        level: parent,
        height: 0,
        //设置标题
        setTitle: function (id, title) {
            var that = this;
            var findNode = function (parentNode) {
                for (var i = 0; i < parentNode.length; i++) {
                    if (parentNode[i].frameId == id) {
                        if (parentNode[i].uiName != "正在载入..") {
                            break;
                        }
                        parentNode[i].uiName = title;
                        $("#title-" + id).html(title);
                        $("#title-" + id).attr('title', title);
                        if (id == that.nowFrame.attr('id').replace('Frame_', '')) {
                            that.modalWindow.setTitle("透视图&nbsp;&nbsp;-&nbsp;&nbsp;" + title);
                        }
                        break;
                    } else {
                        findNode(parentNode[i].childNodes);
                    }
                }
            }
            findNode(this.openedUi);
        },
        init: function (page, title, pars, titlePar, parentId, isSendToolBar) {
            /*
            *1.判断层级
            */
            this.level = parent;
            if (window.isMainEpr) {
                this.level = window;
            }
            this.height = ($(this.level).height() / 10) * 9;

            /*
            *2.构造框架结构
            */
            this.createPoppage();


            /*
            *3.构造frame
            */
            var popItem = { frameId: '', parentFrameId: '', uiName: '正在载入..', childNodes: [] };
            if (title != "") {
                popItem.uiName = title;
            }
            this.modalWindow.setTitle("透视图&nbsp;&nbsp;-&nbsp;&nbsp;" + popItem.uiName);
            popItem.parentFrameId = parentId;
            popItem.frameId = this.createFrameUi(page, title, pars, titlePar, parentId, isSendToolBar);

            //如果有相同的就直接掐断了
            if (popItem.frameId == 'same') {
                return;
            }

            /*
            *4.关闭其他iframe,显示当前的iframe
            */
            $('.popIframe').hide();
            $(this.nowFrame).show();

            /*
            *5.组合树状结构
            */
            if (this.openedUi.length == 0) {
                this.openedUi.push(popItem);
                //创建界面上的树节点
                this.createTree(popItem, null);
            } else {
                this.createTreeNode(popItem, this.openedUi);
                $("#jmreport-poppage-tree-content").parent().animate({ width: 200 }, 300);
                $("#jmreport-poppage-tree-content").animate({ width: 200 }, 300);
            }

        },
        //创建树节点
        createTree: function (item, parentId) {
            $("div#jmreport-poppage-tree-content span.title").attr('class', 'title');
            var htmlNode = $("<li id='tree-" + item.frameId + "' >"
                           + "    <span id='icon-" + item.frameId + "' class='icon' ></span>"
                           + "    <span id='title-" + item.frameId + "' class='title' >" + item.uiName + "</span>"
                           + "    <ul id='child-" + item.frameId + "' ></ul>"
                           + "</li>");
            if (parentId) {
                $("#child-" + parentId).append(htmlNode);
            } else {
                $("#jmreport-poppage-tree").append(htmlNode);
            }

            /*
            *1.绑定事件
            */
            this.treeEvent(htmlNode, item);

            /*
            *2.绑定样式
            */
            this.treeStyle(htmlNode, item);
        },
        //创建树的事件
        treeEvent: function (htmlNode, item) {
            var that = this;
            var clickEvent = function (event) {
                that.changeUi(item.frameId, item.uiName);
                event.stopPropagation();
            }
            htmlNode.find("span.title").click(clickEvent);
            htmlNode.find("span.icon").click(clickEvent);
        },
        changeUi: function (id, name) {
            $('.popIframe').hide();
            this.nowFrame = $("#Frame_" + id).show();
            $("div#jmreport-poppage-tree-content span.title").attr('class', 'title');
            $("#title-" + id).addClass("boldTitle");
            this.modalWindow.setTitle("透视图&nbsp;&nbsp;-&nbsp;&nbsp;" + name);
        },
        //设置树的样式
        treeStyle: function (htmlNode, item) {
            if (item.parentFrameId == 'no') {
                htmlNode.addClass('master');
            } else {
                if (htmlNode.parent().parent().attr('class') == 'master') {
                    htmlNode.parent().parent().addClass('open');
                }
                if (htmlNode.parent().parent().attr('class') == 'childNode') {
                    htmlNode.parent().parent().addClass('childNode open');
                }
                if (htmlNode.parent().parent().attr('class') == 'childNode end') {
                    htmlNode.parent().parent().addClass('childNode end open');
                }
                var nodeMate = htmlNode.parent().children();
                for (var i = 0; i < nodeMate.length; i++) {
                    if ($(nodeMate[i]).find('ul').children().length > 0) {
                        $(nodeMate[i]).attr('class', 'childNode open');
                    } else {
                        $(nodeMate[i]).attr('class', 'childNode');
                    }
                }
                htmlNode.addClass('childNode');
                htmlNode.addClass('end');
            }
            htmlNode.find('span.title').addClass("boldTitle");
        }
        ,
        //组合树状结构
        createTreeNode: function (node, parentNode) {
            for (var i = 0; i < parentNode.length; i++) {
                if (parentNode[i].frameId == node.parentFrameId) {
                    //将分支加入节点中
                    parentNode[i].childNodes.push(node);
                    //将节点加入树中
                    this.createTree(node, parentNode[i].frameId);
                    break;
                } else {
                    this.createTreeNode(node, parentNode[i].childNodes);
                }
            }
        },
        //构造窗体的基本框架结构
        createPoppage: function () {
            if (!this.level.document.getElementById('jmreport-poppage-frame-content')) {
                this.clearInfo();
                var popPage = $('<div class="jmreport-poppage"></div>').attr("style", "padding:0px;margin:-10px;height:" + this.height + "px");
                popPage.css('overflow', "hidden");
                this.treeContent = $('<table  border="0" cellpadding="0" cellspacing="0" style="width:100%" ><tr><td style="width:0px" valign="top" ><div id="jmreport-poppage-tree-content" ><ul id="jmreport-poppage-tree"></ul></div></td><td><div id="jmreport-poppage-frame-content"></div></td></table>').appendTo(popPage).height(this.height);
                this.treeContent.find("#jmreport-poppage-tree-content").height(this.height);
                //创建窗体
                var that = this;
                this.modalWindow = this.level.eprModal({
                    title: '透视图',
                    content: popPage,
                    width: '90%',
                    openByMouse: true,
                    mouseClose: true,
                    closeCall: function () {
                        that.clearInfo();
                    }
                });
            }
        },
        //构造frame
        createFrameUi: function (page, title, pars, titlePar, parentPopId, isSendToolBar) {
            var frameID = +new Date;
            var tempFrame = $('<iframe frameborder="0" class="popIframe" id="Frame_' + frameID + '" ></iframe>');
            tempFrame.attr('parentId', parentPopId);

            //poppageUrl变量在Views/Home/Index.cshtml 页面中被绑定
            //在这里同步domain
            var domainStr = '';

            if (getUrlParams()['setDomain']) {
                domainStr = "&setDomain=" + getUrlParams()['setDomain'];
            }

            var url = oap.rootUrl + 'Home/Page/zh-CN?app=' + jmreport.app.ID + '&page=' + page + domainStr;

            //如果指定要传送toolbar参数
            //组合现有参数
            if (isSendToolBar) {
                var pars = self.getParams();
                if (pars && pars.length > 0) {
                    for (var i = 0; i < pars.length; i++) {
                        url += '&' + pars[i].ColumnName + '=' + encodeURIComponent(pars[i].Value);
                    }
                } 
            }
            if (titlePar) {
                url += '&pagePar=' + window.encodeURI(titlePar);
            }


            //检查重复
            var isSame = false;
            var frames = $('.popIframe');
            for (var i = 0; i < frames.length; i++) {
                if ($(frames[i]).attr('compare-src') == url) {
                    this.changeUi($(frames[i]).attr('id').replace('Frame_', ''), $("#title-" + $(frames[i]).attr('id').replace('Frame_', '')).html());
                    isSame = true;
                    break;
                }
            }
            tempFrame.attr('compare-src', url);

            url += '&thisNode=' + frameID;
            tempFrame.attr('src', url);
            tempFrame.height(this.height);
            tempFrame.appendTo(this.frameContent);

            this.openedFrame.push(tempFrame);
            this.nowFrame = tempFrame;
            if (isSame) {
                return "same";
            } else {
                return frameID;
            }
        },
        clearInfo: function () {
            this.openedUi = [];
            this.openedFrame = [];
            this.nowFrame = null;
            this.modalWindow = null;
        }
    }
    /**
    * 打开弹窗页面
    */
    this.openPopPage = function (page, title, pars, titlePar, isSendToolBar) {
        page = $.trim(page.toLowerCase());
        //如果有绑定打开页面委托，则直接调用委托
        //而且委托返回false的话，不再调用后面的打开页面处理，否则查用后面的打开页面

        if (this.openPageHandler) {
            var r = this.openPageHandler.call(this, page, title, pars);
            if (r === false) {
                return;
            }
        }
        if (page.indexOf('http://') == 0 || page.indexOf('https://') == 0) {
            window.open(page);
        }
        else {
            //判断层级
            level = parent;
            if (window.isMainEpr) {
                level = window;
            }
            var parentId = null;
            if (getUrlParams()['thisNode']) {
                parentId = getUrlParams()['thisNode'];
            } else {
                parentId = 'no';
            }
            level.jmreport.currentPage.poppageControl.init(page, title, pars, titlePar, parentId, isSendToolBar);
        }
    }
}