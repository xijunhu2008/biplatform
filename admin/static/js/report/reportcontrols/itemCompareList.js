/**
* 数据项对比列表控件
*/
jmreport.reportControls.controlTypes['itemCompareList'] = function (config) {
    jmreport.reportControls.controlTypes.initControl.call(this, config); //初始化
    var self = this;
    /**
    * 生成对比项
    */
    this.createItem = function (data) {
        var item = $('<ul class="jmreport-itemCompareList-item"></ul>');

        var dtext = '';
        if (data.description) {
            dtext = data.description.split('|')[0];
        }
        var discriptions = "<span class='cDescription' title='" + dtext + "' >?<span>";
        $('<li class="item-title"></li>').appendTo(item).html(data.title + discriptions).attr('title', dtext);
        var itemvalue = $('<li class="item-value"></li>').appendTo(item).html(data.value);
        //使用列说明解析器
        this.descriptionReader(data.description, function (name) {
            itemvalue.attr('title', '点击打开：【' + name + '】');
        }, function (link, name, paramMapping) {
            var par = self.poppageParaCreator(data.dataRow.ItemArray, paramMapping);
            itemvalue.css('cursor', 'pointer');
            itemvalue.click(function () {
                self.report.page.openPopPage(link, name, undefined, par.par, par.isSendToolBar);
            });
        });


        //生成底部同环比项
        if (data.compares && data.compares.length > 0) {
            var compareItem = $('<li></li>').appendTo(item);
            for (var i = data.compares.length - 1; i > -1; i--) {
                var c = data.compares[i];
                var itemline = $('<div class="compare-item"></div>').appendTo(compareItem);
                $('<label></label>').appendTo(itemline).html(c.name);
                var vspan = $('<span></span>').appendTo(itemline).html(c.value).attr('title', c.description);
                if (c.value.indexOf('-') != -1) {
                    vspan.toggleClass('red', true);
                }
                else {
                    vspan.toggleClass('green', true);
                }
            }
        }
        return item;
    }

    /**
    * 绑定数据
    */
    this.bind = function () {
        if (!this.data) return;
        this.control.empty();
        var dt = this.data.Tables[0];
        if (dt.Rows.length <= 0) {
            this.log('暂无数据哦，亲！');
            return;
        }
        var container = $('<ul class="jmreport-itemCompareList"></ul>');
        for (var i = 0; i < dt.Rows.length; i++) {
            var row = dt.Rows[i];
            var data = {
                date: row.ItemArray[0].Value
            };
            //第二列表示项标题对应的列映射信息
            var titlcolumn = dt.getColumnMapping(row.ItemArray[1].Value);
            if (!titlcolumn) {
                titlcolumn = dt.getColumnMapping(row.ItemArray[2].ColumnName);
            }
            if (!titlcolumn) {
                data.title = '';
                data.description = '';
            } else {
                data.title = titlcolumn.DisplayName;
                data.description = titlcolumn.Description;
            }
            data.value = jmreport.helper.convertUnit(row.ItemArray[2].Value);
            if (this.config.config.BaseUnitsX) data.value += this.config.config.BaseUnitsX;
            data.compares = [];
            //如果超过三列，则后面为同环比数据
            if (row.ItemArray.length > 3) {
                for (var j = 3; j < row.ItemArray.length; j++) {
                    var item = row.ItemArray[j];
                    var column = dt.getColumn(item.ColumnName);
                    data.compares.push({
                        name: column.DisplayName || column.Name,
                        description: column.Description,
                        value: item.Value
                    });
                }
            }
            data.dataRow = row;
            //生成每一个元素
            var item = this.createItem(data);
            var itemcontainer = $('<li></li>').appendTo(container);
            if (i == dt.Rows.length - 1) {
                itemcontainer.toggleClass('last', true);
            }
            item.appendTo(itemcontainer);
        }
        container.appendTo(this.control);
        container.css('height', 'auto');
        container.parent().css('height', 'auto');

        //完成渲染调用此方法
        //此方法位于jmreport.reportControls.js
        this.drawCompleteCallBack();
    }
}
jmreport.reportControls.register('OneTextItemCompareList', jmreport.reportControls.controlTypes.itemCompareList);
