-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: dbWebServer
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbcontrols`
--

DROP TABLE IF EXISTS `tbcontrols`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbcontrols` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `controltype` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcontrols`
--

LOCK TABLES `tbcontrols` WRITE;
/*!40000 ALTER TABLE `tbcontrols` DISABLE KEYS */;
INSERT INTO `tbcontrols` VALUES (1,'CheckBoxList','多选下拉框',0),(2,'ComboBoxOne','单选下拉框',0),(3,'DateTimeOne','单日期选择框',0),(4,'DateTimePickerOne','单时间选择框（带时间）',0),(5,'DateTimeTwo','双日期先择控件',0),(6,'HalfaYearOne','半年选择控件',0),(7,'HorizontalListBox','水平排列选项控件',0),(8,'MonthOne','月份选择控件',0),(9,'TextBox','文本框',0),(10,'GridViewData','表格',1),(11,'JMChart','图表',1),(12,'OneTextItemCompareList','首页对比项列表',1);
/*!40000 ALTER TABLE `tbcontrols` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdataserver`
--

DROP TABLE IF EXISTS `tbdataserver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbdataserver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT '0',
  `label` varchar(32) DEFAULT NULL,
  `servertype` smallint(6) DEFAULT NULL,
  `host` varchar(32) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `user` varchar(32) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `database` varchar(64) DEFAULT NULL,
  `otherattr` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdataserver`
--

LOCK TABLES `tbdataserver` WRITE;
/*!40000 ALTER TABLE `tbdataserver` DISABLE KEYS */;
INSERT INTO `tbdataserver` VALUES (2,'抽象业务结果库','dbResult',0,'192.168.1.133',3306,'oss','oss','dbDJOssResult','charset=utf8'),(3,'抽象业务配置库','dbConf',0,'192.168.1.133',3306,'oss','oss','dbOssConf','charset=utf8'),(4,'大剑结果库','dbResult_dj',0,'192.168.1.133',3306,'oss','oss','dbDJOssResult',''),(5,'大剑配置表','dbConf_dj',0,'192.168.1.133',3306,'oss','oss','dbOssConf','');
/*!40000 ALTER TABLE `tbdataserver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdatasource`
--

DROP TABLE IF EXISTS `tbdatasource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbdatasource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT NULL,
  `requestparam` varchar(6144) DEFAULT NULL,
  `methodname` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdatasource`
--

LOCK TABLES `tbdatasource` WRITE;
/*!40000 ALTER TABLE `tbdatasource` DISABLE KEYS */;
INSERT INTO `tbdatasource` VALUES (1,'服务器1','select serverId,date_format(dActionTime,\'%Y-%m-%d\') as onlinetime,max(onlineNum) as pcu,CEILING(sum(onlineNum) / 24) as acu \nfrom onlinelog where  (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\'  group by serverId,onlinetime order by serverId,dActionTimes2','query'),(2,'测试随机数','select createon,id,rand() * 30 as \'随机数\' from tbproduction where createon >= \'%start%\' and createon <= \'%end%\'','query'),(3,'游戏大区','select iWorldId,vWorldName from tbCapacity order by iWorldId desc','query'),(4,'实时在线','select t1.dtStatDate,\'总注册用户\' Name,t1.iAllRegNum,\ncase when t1.iAllRegNum = t2.iAllRegNum then \'0.00%\' when t2.iAllRegNum != 0 then concat(round((cast(t1.iAllRegNum as signed)-cast(t2.iAllRegNum as signed))*100/t2.iAllRegNum,2),\'%\') else \'+∞%\' end DayRate,\ncase when t1.iAllRegNum = t3.iAllRegNum then \'0.00%\' when t3.iAllRegNum != 0 then concat(round((cast(t1.iAllRegNum as signed)-cast(t3.iAllRegNum as signed))*100/t3.iAllRegNum,2),\'%\') else \'+∞%\' end WeekRate \nfrom \n(select dtStatDate,iAllRegNum \nfrom tbUserRegister \nwhere dtStatDate = \'%end%\' and iAccountTypeId = 1 and iWorldId = %world%) t1,\n(select dtStatDate,iAllRegNum \nfrom tbUserRegister \nwhere dtStatDate = date_add(\'%end%\', interval -1 day) and iAccountTypeId = 1 and iWorldId = %world%) t2,\n(select dtStatDate,iAllRegNum \nfrom tbUserRegister \nwhere dtStatDate = date_add(\'%end%\', interval -1 week) and iAccountTypeId = 1 and iWorldId = %world%) t3\nunion \nselect t1.dtStatDate,\'日新增注册用户\' Name,t1.iDayRegNum,\ncase when t1.iDayRegNum = t2.iDayRegNum then \'0.00%\' when t2.iDayRegNum != 0 then concat(round((cast(t1.iDayRegNum as signed)-cast(t2.iDayRegNum as signed))*100/t2.iDayRegNum,2),\'%\') else \'+∞%\' end DayRate,\ncase when t1.iDayRegNum = t3.iDayRegNum then \'0.00%\' when t3.iDayRegNum != 0 then concat(round((cast(t1.iDayRegNum as signed)-cast(t3.iDayRegNum as signed))*100/t3.iDayRegNum,2),\'%\') else \'+∞%\' end WeekRate \nfrom \n(select dtStatDate,iDayRegNum \nfrom tbUserRegister \nwhere dtStatDate = \'%end%\' and iAccountTypeId = 1 and iWorldId = %world%) t1,\n(select dtStatDate,iDayRegNum \nfrom tbUserRegister \nwhere dtStatDate = date_add(\'%end%\', interval -1 day) and iAccountTypeId = 1 and iWorldId = %world%) t2,\n(select dtStatDate,iDayRegNum \nfrom tbUserRegister \nwhere dtStatDate = date_add(\'%end%\', interval -1 week) and iAccountTypeId = 1 and iWorldId = %world%) t3\nunion \nselect t1.dtStatDate,\'日活跃用户\' Name,t1.iDayActivityNum,\ncase when t1.iDayActivityNum = t2.iDayActivityNum then \'0.00%\' when t2.iDayActivityNum != 0 then concat(round((cast(t1.iDayActivityNum as signed)-cast(t2.iDayActivityNum as signed))*100/t2.iDayActivityNum,2),\'%\') else \'+∞%\' end DayRate,\ncase when t1.iDayActivityNum = t3.iDayActivityNum then \'0.00%\' when t3.iDayActivityNum != 0 then concat(round((cast(t1.iDayActivityNum as signed)-cast(t3.iDayActivityNum as signed))*100/t3.iDayActivityNum,2),\'%\') else \'+∞%\' end WeekRate \nfrom \n(select dtStatDate,iDayActivityNum \nfrom tbUserLogin \nwhere dtStatDate = \'%end%\' and iAccountTypeId = 1 and iWorldId = %world%) t1,\n(select dtStatDate,iDayActivityNum \nfrom tbUserLogin \nwhere dtStatDate = date_add(\'%end%\', interval -1 day) and iAccountTypeId = 1 and iWorldId = %world%) t2,\n(select dtStatDate,iDayActivityNum \nfrom tbUserLogin \nwhere dtStatDate = date_add(\'%end%\', interval -1 week) and iAccountTypeId = 1 and iWorldId = %world%) t3\nunion \nselect t1.dtStatDate,\'充值额（元）\' Name,t1.iStore,\ncase when t1.iStore = t2.iStore then \'0.00%\' when t2.iStore != 0 then concat(round((cast(t1.iStore as signed)-cast(t2.iStore as signed))*100/t2.iStore,2),\'%\') else \'+∞%\' end DayRate,\ncase when t1.iStore = t3.iStore then \'0.00%\' when t3.iStore != 0 then concat(round((cast(t1.iStore as signed)-cast(t3.iStore as signed))*100/t3.iStore,2),\'%\') else \'+∞%\' end WeekRate \nfrom \n(select dtStatDate,iStore \nfrom tbStoreGamePoints \nwhere dtStatDate = \'%end%\' and iAccountTypeId = 1 and iWorldId = %world%) t1,\n(select dtStatDate,iStore \nfrom tbStoreGamePoints \nwhere dtStatDate = date_add(\'%end%\', interval -1 day) and iAccountTypeId = 1 and iWorldId = %world%) t2,\n(select dtStatDate,iStore \nfrom tbStoreGamePoints \nwhere dtStatDate = date_add(\'%end%\', interval -1 week) and iAccountTypeId = 1 and iWorldId = %world%) t3\nunion \nselect t1.dtStatDate,\'消费额（钻石）\' Name,t1.iConsume,\ncase when t1.iConsume = t2.iConsume then \'0.00%\' when t2.iConsume != 0 then concat(round((cast(t1.iConsume as signed)-cast(t2.iConsume as signed))*100/t2.iConsume,2),\'%\') else \'+∞%\' end DayRate,\ncase when t1.iConsume = t3.iConsume then \'0.00%\' when t3.iConsume != 0 then concat(round((cast(t1.iConsume as signed)-cast(t3.iConsume as signed))*100/t3.iConsume,2),\'%\') else \'+∞%\' end WeekRate \nfrom \n(select dtStatDate,iConsume \nfrom tbConsumeGamePoints \nwhere dtStatDate = \'%end%\' and iAccountTypeId = 1 and iWorldId = %world%) t1,\n(select dtStatDate,iConsume \nfrom tbConsumeGamePoints \nwhere dtStatDate = date_add(\'%end%\', interval -1 day) and iAccountTypeId = 1 and iWorldId = %world%) t2,\n(select dtStatDate,iConsume \nfrom tbConsumeGamePoints \nwhere dtStatDate = date_add(\'%end%\', interval -1 week) and iAccountTypeId = 1 and iWorldId = %world%) t3','query'),(5,'实时注册人数','select dActionTime,count(iUserId) from registerlog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' GROUP BY date_format(dActionTime,\'%Y-%m-%d %H\') order by dActionTime',NULL),(6,'用户当日总况','select date_format(t1.dtStatDate,\'%Y-%m-%d\') dtStatDate,iAllRegNum,iDayRegNum,iDayActivityNum  \nfrom tbUserRegister t1 left join tbUserLogin t2 \non t1.dtStatDate = t2.dtStatDate and t1.iAccountTypeId = t2.iAccountTypeId and t1.iWorldId = t2.iWorldId \nwhere t1.dtStatDate >= \'%start%\' and t1.dtStatDate <= \'%end% 23:59:59\' and t1.iAccountTypeId = 1 and t1.iWorldId = 65535 \norder by dtStatDate',NULL),(7,'周注册和活跃人数','select date_format(t1.dtStatDate,\'%Y-%m-%d\') dtStatDate,iWeekRegNum,iWeekActivityNum,iWeekLostNum,iWeekBackNum  \nfrom tbUserRegister t1 left join tbUserLogin t2 \non t1.dtStatDate = t2.dtStatDate and t1.iAccountTypeId = t2.iAccountTypeId and t1.iWorldId = t2.iWorldId \nwhere t1.dtStatDate >= \'%start%\' and t1.dtStatDate <= \'%end% 23:59:59\' and t1.iAccountTypeId = 1 and t1.iWorldId = 65535 \norder by dtStatDate',NULL),(8,'新注册用户当日等级分布情况','select t1.serverId,date_format(t1.dActionTime,\'%Y-%m-%d\') regtime,concat(if(t2.userlevel is null,1,t2.userlevel),\'级\') userlevel,count(t1.iUserId) usercount from registerlog t1\r\nleft join (select serverId,iUserId,max(iUserLv) as userlevel,date_format(dActionTime,\'%Y-%m-%d\') as leveltime from levelchangelog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime<=\'%end% 23:59:59\' group by serverId,leveltime,iUserId) t2\r\non t2.iUserId=t1.iUserId and t2.serverId=t1.serverId and t2.leveltime=date_format(t1.dActionTime,\'%Y-%m-%d\')\r\nwhere (t1.serverId=%world% or %world%=-1) and t1.dActionTime>=\'%start%\' and t1.dActionTime<=\'%end% 23:59:59\'\r\ngroup by t1.serverId,regtime,t2.userlevel\r\norder by t2.userlevel,t1.dActionTime','query'),(9,'新注册用户留存情况（90）天','select t1.serverId,t3.regtime,t3.regcount,datediff(t2.logintime,t3.regtime) + 1 as diffday,count(t2.iUserId) as activenum,concat(round(count(t2.iUserId)/t3.regcount,2)*100,\'%\') as lzper\r\nfrom registerlog t1 \r\nleft join (select serverId,date_format(dActionTime,\'%Y-%m-%d\') regtime,count(iUserId) regcount from registerlog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime<=\'%end% 23:59:59\' group by serverId,regtime) t3 on t3.regtime=date_format(t1.dActionTime,\'%Y-%m-%d\')\r\nleft join (select distinct serverId,iUserId,date_format(dActionTime,\'%Y-%m-%d\') as logintime from loginlog) t2 on t2.iUserId=t1.iUserId and t1.serverId=t2.serverId and t2.logintime >= t3.regtime \r\nwhere (t1.serverId=%world% or %world%=-1) and t1.dActionTime>=\'%start%\' and t1.dActionTime<=\'%end% 23:59:59\' and t2.logintime is not null\r\ngroup by t2.logintime,regtime\r\norder by regtime,logintime',NULL),(10,'总注册用户等级分布情况','select if(t2.userlevel is null,1,t2.userlevel) as userlevel,count(t1.iUserId) usercount,t1.serverId\r\nfrom registerlog t1 left join (select iUserId,serverId,max(iUserLv) userlevel from levelchangelog where serverId=%world% or %world%=-1 group by serverId,iUserId) t2 on t2.serverId=t1.serverId and t2.iUserId=t1.iUserId\r\nwhere t1.serverId=%world% or %world%=-1\r\ngroup by t1.serverId,t2.userlevel',NULL),(11,'钻石的产出渠道','select t1.serverId,DATE_FORMAT(t1.dActionTime,\'%Y-%m-%d\') as actiontime,t2.displayname,sum(t1.iChangeNum) as changenum from diamondlog t1 left join tbdiamondactiontype t2 on t2.id=t1.actionType where t1.actionway=1 and (t1.serverId=%world% or %world%=-1) and t1.dActionTime>=\'%start%\' and t1.dActionTime<=\'%end% 23:59:59\' group by serverId,t1.actionType,actiontime order by t1.serverId,t1.dActionTime,t1.actionType',NULL),(12,'钻石的消耗渠道','select t1.serverId,DATE_FORMAT(t1.dActionTime,\'%Y-%m-%d\') as actiontime,t2.displayname,sum(t1.iChangeNum) as changenum from diamondlog t1 left join tbdiamondactiontype t2 on t2.id=t1.actionType where t1.actionway=2 and (t1.serverId=%world% or %world%=-1) and t1.dActionTime>=\'%start%\' and t1.dActionTime<=\'%end% 23:59:59\' group by serverId,t1.actionType,actiontime order by t1.serverId,t1.dActionTime,t1.actionType',NULL),(13,'美人召唤次数','select serverId,DATE_FORMAT(dActionTime,\'%Y-%m-%d\') as actiontime,concat(\'美人\',beautyType) as beautyname,count(beautyNum) as beautynum from beautylog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' group by serverId,actiontime,beautyType order by actiontime,beautyType',NULL),(14,'装备等级分布','select concat(\'大区\',t1.serverId) as serverId,t1.iequiplv,count(t1.equipId) as equipcount \r\nfrom (select serverId,equipId,max(iequipLv) as iequiplv \r\nfrom equiplog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' group by serverId,equipId) t1 \r\ngroup by t1.serverId,t1.iequiplv order by t1.iequiplv,t1.serverId',NULL),(15,'美人等级分布',' select t2.serverId,t2.actiontime,concat(t2.beautystar,\'星美人\') as beautystar,\r\ncase when t2.beautystar=1 and t2.beautyLvl<4 then \'1-3级\' when t2.beautystar=1 then \'4-5级\' when t2.beautystar=2 and t2.beautyLvl<6 then \'1-5级\' when t2.beautystar=2 and t2.beautyLvl<20 then \'6-19级\' when t2.beautystar=2 then \'20级\'\r\nwhen t2.beautystar=3 and t2.beautyLvl<21 then \'1-20级\' when t2.beautystar=3 and t2.beautyLvl<31 then \'21-30级\' when t2.beautystar=3 and t2.beautyLvl<40 then \'31-39级\' when t2.beautystar=3 then \'40级\'\r\nwhen t2.beautystar=4 and t2.beautyLvl<21 then \'1-20级\' when t2.beautystar=4 and t2.beautyLvl<31 then \'21-30级\' when t2.beautystar=4 and t2.beautyLvl<41 then \'31-40级\' when t2.beautystar=4 and t2.beautyLvl<51 then \'41-50级\' when t2.beautystar=4 and t2.beautyLvl<60 then \'51-59级\' when t2.beautystar=4 then \'60级\'\r\nwhen t2.beautystar=5 and t2.beautyLvl<21 then \'1-20级\' when t2.beautystar=5 and t2.beautyLvl<31 then \'21-30级\' when t2.beautystar=5 and t2.beautyLvl<41 then \'31-40级\' when t2.beautystar=5 and t2.beautyLvl<51 then \'41-50级\' when t2.beautystar=5 and t2.beautyLvl<61 then \'51-60级\' when t2.beautystar=5 and t2.beautyLvl<71 then \'61-70级\' when t2.beautystar=5 and t2.beautyLvl<80 then \'71-79级\' when t2.beautystar=5 then \'80级\' end as beautylvl\r\n,sum(t2.beautyNum) as beautynum\r\n from (select t1.serverId,t1.actiontime,case when t1.beautytype<9 then 1 when t1.beautytype <25 then 2 when t1.beautytype<41 then 3 when t1.beautytype<53 then 4 else 5 end as beautystar,t1.beautyLvl,t1.beautyNum\r\n from (select serverId,DATE_FORMAT(dActionTime,\'%Y-%m-%d\') as actiontime,beautyType%100 as beautytype,beautyLvl,beautyNum from beautylog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\') t1) t2 group by t2.serverId,t2.actiontime,t2.beautystar,beautylvl order by t2.serverId,t2.actiontime,beautystar,beautylvl',NULL),(16,'装备阶数分布','select concat(\'大区\',t1.serverId) as serverId,t1.iequipclass,count(t1.equipId) as equipcount \r\nfrom (select serverId,equipId,max(iequipClass) as iequipclass \r\nfrom equiplog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' group by serverId,equipId) t1 \r\ngroup by t1.serverId,t1.iequipclass order by t1.iequipclass,t1.serverId',NULL),(17,'首次通关','select distinct t1.serverId,t1.gameMapId,t1.gameLvId,concat(\'难度\',t1.gameRank) as gameRank,t2.intimes,t3.passtimes\r\nfrom battlelog t1\r\nleft join\r\n(select serverId,gameMapId,gameLvId,gameRank,count(distinct iUserId) as intimes from(select serverId,min(dActionTime) as dActionTime,iUserId,gameMapId,gameLvId,gameRank from battlelog \r\nwhere inBattle=1 and (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' \r\ngroup by serverId,gameMapId,gameLvId,gameRank,iUserId) t5 group by serverId,gameMapId,gameLvId,gameRank) t2 on t2.serverId=t1.serverId and t2.gameMapId=t1.gameMapId and t2.gameLvId=t1.gameLvId and t2.gameRank=t1.gameRank\r\nleft join\r\n(select serverId,gameMapId,gameLvId,gameRank,count(distinct iUserId) as passtimes from \r\n(select serverId,min(dActionTime) as dActionTime,iUserId,gameMapId,gameLvId,gameRank from battlelog \r\nwhere passBattle=1 and (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' \r\ngroup by serverId,gameMapId,gameLvId,gameRank,iUserId) t4 group by serverId,gameMapId,gameLvId,gameRank) t3\r\n on t3.serverId=t1.serverId and t3.gameMapId=t1.gameMapId and t3.gameLvId=t1.gameLvId and t3.gameRank=t1.gameRank\r\nwhere (t1.serverId=%world% or %world%=-1) and t1.dActionTime>=\'%start%\' and t1.dActionTime <=\'%end% 23:59:59\'\r\norder by t1.serverId,t1.gameMapId,t1.gameLvId,t1.gameRank',NULL),(18,'美人数量分布','select concat(\'大区\',serverId) as serverId,beautyType,count(beautyNum) as beautynum \r\nfrom beautylog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\' \r\ngroup by serverId,beautyType order by beautyType,serverId',NULL),(19,'美人等级分布图',' select concat(t2.beautystar,\'星美人\') as beautystar,t2.beautyLvl\r\n,sum(t2.beautyNum) as beautynum\r\n from (select t1.serverId,case when t1.beautytype<9 then 1 when t1.beautytype <25 then 2 when t1.beautytype<41 then 3 when t1.beautytype<53 then 4 else 5 end as beautystar,t1.beautyLvl,t1.beautyNum\r\n from (select serverId,beautyType%100 as beautytype,beautyLvl,beautyNum from beautylog where (serverId=%world% or %world%=-1) and dActionTime>=\'%start%\' and dActionTime <=\'%end% 23:59:59\') t1) t2 group by t2.beautystar,beautylvl order by beautystar,beautylvl',NULL),(20,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iAllRegNum,iDayRegNum,iWeekRegNum,iDWeekRegNum,iMonthRegNum from tbUserRegister \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' order by dtStatDate desc',NULL),(21,NULL,'D-7;D-1',NULL),(22,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iAllRegNum,iDayRegNum,iWeekRegNum,iDWeekRegNum,iMonthRegNum from tbUserRegister \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' order by dtStatDate',NULL),(23,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(24,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayActivityNum,iWeekActivityNum,iDWeekActivityNum,iMonthActivityNum,iDMonthActivityNum  \nfrom tbUserLogin  \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end% 23:59:59\' and iAccountTypeId = 1 and iWorldId = %world%  \norder by dtStatDate',NULL),(25,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(26,NULL,'select concat(t1.dtRegDate,\'注册\') dtRegDate,\ncase when t1.iDayNum=0 then \'注册当天\' else concat(\'注册后第\',t1.iDayNum,\'天\') end iDayNum,\nifnull(t2.iUserNum,0) iUserNum,concat(round(ifnull(t2.iUserNum*100/iCumulateUserNum,0),2),\'%\') Rate  \nfrom \n(select dtStatDate,dtRegDate,datediff(dtStatDate,dtRegDate) iDayNum \nfrom tbResidentUser \nwhere dtRegDate >= \'%start%\' and dtRegDate <= \'%end%\' and dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% group by dtRegDate,dtStatDate) t1 \nleft join (select dtStatDate,dtRegDate,iDayNum,iUserNum,iCumulateUserNum \nfrom tbResidentUser \nwhere dtRegDate >= \'%start%\' and dtRegDate <= \'%end%\' and dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world%) t2 \non t1.iDayNum = t2.iDayNum and t1.dtStatDate = t2.dtStatDate and t1.dtRegDate = t2.dtRegDate;',NULL),(27,NULL,'select case when iDayNum = 0 then \'注册当天\' else concat(\'注册后第\',iDayNum,\'天\') end iDayNum,iUserNum \nfrom tbResidentUser t1,(select sum(iUserNum) iCumulateUserNum from tbResidentUser where dtRegDate = \'%start%\' and dtStatDate = \'%end%\' and iWorldId = %world%) t2\nwhere dtRegDate = \'%start%\' and dtStatDate = \'%end%\' and iWorldId = %world%;',NULL),(28,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(29,NULL,'select date_format(t1.dtStatDate,\'%Y-%m-%d\') dtStatDate,iAllRegNum,iDayRegNum,iDayActivityNum  \nfrom tbUserRegister t1 left join tbUserLogin t2 \non t1.dtStatDate = t2.dtStatDate and t1.iAccountTypeId = t2.iAccountTypeId and t1.iWorldId = t2.iWorldId \nwhere t1.dtStatDate >= \'%start%\' and t1.dtStatDate <= \'%end% 23:59:59\' and t1.iAccountTypeId = 1 and t1.iWorldId = 65535 \norder by dtStatDate desc',NULL),(30,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayActivityNum,iWeekActivityNum,iDWeekActivityNum,iMonthActivityNum,iDMonthActivityNum  \nfrom tbUserLogin  \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end% 23:59:59\' and iAccountTypeId = 1 and iWorldId = %world%  \norder by dtStatDate desc;',NULL),(31,NULL,'select dtRegDate,dtStatDate,case when iDayNum = 0 then \'注册\' else concat(\'注册后第\',iDayNum,\'天\') end iDayNum,iUserNum,concat(round(iUserNum*100/t2.iCumulateUserNum,2),\'%\') Rate \nfrom tbResidentUser t1,(select sum(iUserNum) iCumulateUserNum from tbResidentUser where dtRegDate = \'%start%\' and dtStatDate = \'%end%\' and iWorldId = %world%) t2\nwhere dtRegDate = \'%start%\' and dtStatDate = \'%end%\' and iWorldId = %world%;',NULL),(32,NULL,'select date_format(t1.dtStatDate,\'%Y-%m-%d\') dtStatDate,iWeekRegNum,iWeekActivityNum,iWeekLostNum,iWeekBackNum  \nfrom tbUserRegister t1 left join tbUserLogin t2 \non t1.dtStatDate = t2.dtStatDate and t1.iAccountTypeId = t2.iAccountTypeId and t1.iWorldId = t2.iWorldId \nwhere t1.dtStatDate >= \'%start%\' and t1.dtStatDate <= \'%end% 23:59:59\' and t1.iAccountTypeId = 1 and t1.iWorldId = 65535 \norder by dtStatDate desc',NULL),(33,NULL,'select dtStatDate,concat(iLevel,\'级\') vLevel,iDayActivityNum,iWeekActivityNum,iDWeekActivityNum,iMonthActivityNum,iDMonthActivityNum \nfrom tbUserLoginLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end% 23:59:59\' and iWorldId = %world%\norder by dtStatDate desc,iLevel',NULL),(34,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(35,NULL,'select concat(iLevel,\'级\') as vLevel,iDayActivityNum,iWeekActivityNum,iDWeekActivityNum,iMonthActivityNum,iDMonthActivityNum \nfrom tbUserLoginLvDis \nwhere  dtStatDate = \'%end%\' and iWorldId = %world%\norder by iLevel',NULL),(36,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(37,NULL,'select dtStatDate,concat(iActivityDays,\'天\')  vActivityDays,sum(iActivityNum) iActivityNum \nfrom tbMonthActivityScaleLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \ngroup by dtStatDate,iActivityDays\norder by dtStatDate desc,iActivityDays',NULL),(38,NULL,'select concat(iActivityDays,\'天\') vActivityDays,sum(iActivityNum) iActivityNum \nfrom tbMonthActivityScaleLvDis \nwhere dtStatDate = \'%end%\' and iWorldId = %world% \ngroup by iActivityDays\norder by iActivityDays',NULL),(39,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(40,NULL,'select dtStatDate,sum(iDayActivityNum) iDayActivityNum,sum(iWeekActivityNum) iWeekActivityNum,sum(iDWeekActivityNum) iDWeekActivityNum,sum(iMonthActivityNum) iMonthActivityNum \nfrom tbPayUserLoginLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \ngroup by dtStatDate \norder by dtStatDate desc',NULL),(41,NULL,'select dtStatDate,sum(iDayActivityNum) iDayActivityNum,sum(iWeekActivityNum) iWeekActivityNum,sum(iDWeekActivityNum) iDWeekActivityNum,sum(iMonthActivityNum) iMonthActivityNum \nfrom tbPayUserLoginLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \ngroup by dtStatDate \norder by dtStatDate',NULL),(42,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(43,NULL,'select dtStatDate,sum(iDayActivityNum) iDayActivityNum,sum(iWeekActivityNum) iWeekActivityNum,sum(iDWeekActivityNum) iDWeekActivityNum,sum(iMonthActivityNum) iMonthActivityNum \nfrom tbFreeUserLoginLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \ngroup by dtStatDate \norder by dtStatDate desc',NULL),(44,NULL,'select dtStatDate,sum(iDayActivityNum) iDayActivityNum,sum(iWeekActivityNum) iWeekActivityNum,sum(iDWeekActivityNum) iDWeekActivityNum,sum(iMonthActivityNum) iMonthActivityNum \nfrom tbFreeUserLoginLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \ngroup by dtStatDate \norder by dtStatDate',NULL),(45,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(46,NULL,'select t2.dtStatDate as dtStatDate,t1.vSegmentName as vSegmentName,t2.iSegmentNum  iSegmentNum \nfrom dbOssConf.tbPlayTimeSegmentConf t1 join (select dtStatDate,iSegment,iSegmentNum from tbPlayTimeSegDis where dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world%) t2 \non t1.iSegment = t2.iSegment \norder by t2.dtStatDate desc,t1.iSegment;',NULL),(47,NULL,'select t1.vSegmentName,t2.iSegmentNum  \nfrom dbOssConf.tbPlayTimeSegmentConf t1 left join (select dtStatDate,iSegment,iSegmentNum from tbPlayTimeSegDis where dtStatDate = \'%end%\' and iWorldId = %world%) t2 \non t1.iSegment = t2.iSegment \norder by t1.iSegment;',NULL),(48,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(49,NULL,'select dtStatDate,concat(iLevel,\'级\') vLevel,iOnlineNum,iOnlineTime,round(iOnlineTime/iOnlineNum/60,2) as AvgOnlineTime \nfrom tbPlayTimeSumLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc,iLevel',NULL),(50,NULL,'select concat(iLevel,\'级\') iLevel,round(iOnlineTime/iOnlineNum/60,2) as AvgOnlineTime \nfrom tbPlayTimeSumLvDis \nwhere dtStatDate = \'%end%\' and iWorldId = %world% \norder by iLevel',NULL),(51,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(52,NULL,'select dtStatDate,iAllDepositorNum,iDayDepositorNum,iWeekDepositorNum,iDWeekDepositorNum,iMonthDepositorNum \nfrom tbDepositors \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc',NULL),(53,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayDepositorNum,iWeekDepositorNum,iDWeekDepositorNum,iMonthDepositorNum \nfrom tbDepositors \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate ',NULL),(54,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(55,NULL,'select dtStatDate,iDayNewDepositorNum,iWeekNewDepositorNum,iDWeekNewDepositorNum,iMonthNewDepositorNum \nfrom tbNewDepositors \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc',NULL),(56,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayNewDepositorNum,iWeekNewDepositorNum,iDWeekNewDepositorNum,iMonthNewDepositorNum \nfrom tbNewDepositors \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate',NULL),(57,NULL,'select dtStatDate,iAllPayNum,iDayPayNum,iWeekPayNum,iDWeekPayNum,iMonthPayNum \nfrom tbPayer \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc',NULL),(58,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(59,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayPayNum,iWeekPayNum,iDWeekPayNum,iMonthPayNum \nfrom tbPayer \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate',NULL),(60,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(61,NULL,'select dtStatDate,iDayNewPayNum,iWeekNewPayNum,iDWeekNewPayNum,iMonthNewPayNum \nfrom tbNewPayer \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc\n',NULL),(62,NULL,'select date_format(dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayNewPayNum,iWeekNewPayNum,iDWeekNewPayNum,iMonthNewPayNum \nfrom tbNewPayer \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate',NULL),(63,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(64,NULL,'select dtStatDate,concat(iLevel,\'级\') vLevel,iDayNewPayNum,iWeekNewPayNum,iDWeekNewPayNum,iMonthNewPayNum \nfrom tbNewPayerLvDis \nwhere dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% \norder by dtStatDate desc,iLevel\n',NULL),(65,NULL,'select concat(iLevel,\'级\') vLevel,iDayNewPayNum,iWeekNewPayNum,iDWeekNewPayNum,iMonthNewPayNum \nfrom tbNewPayerLvDis \nwhere dtStatDate = \'%end%\' and iWorldId = %world% \norder by iDayNewPayNum desc',NULL),(66,NULL,'select concat(t1.dtRegDate,\'注册\') dtRegDate,\ncase when t1.iDayNum=0 then \'注册当天\' else concat(\'注册后第\',t1.iDayNum,\'天\') end iDayNum,\nifnull(t2.iUserNum,0) iUserNum,concat(round(ifnull(t2.iUserNum*100/iCumulateUserNum,0),2),\'%\') Rate  \nfrom \n(select dtStatDate,dtRegDate,datediff(dtStatDate,dtRegDate) iDayNum \nfrom tbResidentUser \nwhere dtRegDate >= \'%start%\' and dtRegDate <= \'%end%\' and dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world% group by dtRegDate,dtStatDate) t1 \nleft join (select dtStatDate,dtRegDate,iDayNum,iUserNum,iCumulateUserNum \nfrom tbResidentUser \nwhere dtRegDate >= \'%start%\' and dtRegDate <= \'%end%\' and dtStatDate >= \'%start%\' and dtStatDate <= \'%end%\' and iWorldId = %world%) t2 \non t1.iDayNum = t2.iDayNum and t1.dtStatDate = t2.dtStatDate and t1.dtRegDate = t2.dtRegDate;',NULL),(67,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(68,NULL,'select dtStatTime,Name,iUserNum from \n(select date_format(dtStatTime,\'%H:%i\') dtStatTime,1 as d,\'今日\' Name,iUserNum from tbRealOnline where dtStatTime >= \'%end%\' and dtStatTime < date_add(\'%end%\',interval 1 day) and iWorldId = %world% \nunion \nselect date_format(dtStatTime,\'%H:%i\') dtStatTime,2 as d,\'昨日\' Name,iUserNum from tbRealOnline where dtStatTime >= date_add(\'%end%\',interval -1 day) and dtStatTime < \'%end%\' and iWorldId = %world% \nunion \nselect date_format(dtStatTime,\'%H:%i\') dtStatTime,3 as d,\'7日前\' Name,iUserNum from tbRealOnline where dtStatTime >= date_add(\'%end%\',interval -7 day) and dtStatTime < date_add(\'%end%\',interval -6 day) and iWorldId = %world% \nunion \nselect date_format(dtStatTime,\'%H:%i\') dtStatTime,4 as d,\'30日前\' Name,iUserNum from tbRealOnline where dtStatTime >= date_add(\'%end%\',interval -30 day) and dtStatTime < date_add(\'%end%\',interval -29 day) and iWorldId = %world% \n) t \norder by d,dtStatTime ',NULL),(69,NULL,'select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc',NULL),(70,NULL,'select date_format(t1.dtStatDate,\'%Y-%m-%d\') dtStatDate,iDayRegNum,iDayActivityNum  \nfrom tbUserRegister t1 left join tbUserLogin t2 \non t1.dtStatDate = t2.dtStatDate and t1.iAccountTypeId = t2.iAccountTypeId and t1.iWorldId = t2.iWorldId \nwhere t1.dtStatDate >= date_add(\'%end%\',interval -30 day) and t1.dtStatDate <= \'%end%\' and t1.iAccountTypeId = 1 and t1.iWorldId = 65535 \norder by dtStatDate',NULL),(71,'服务器1','select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc','query'),(72,'服务器2','select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc12','query'),(73,'服务器1','select iWorldId,vWorldName \nfrom tbCapacity \norder by iWorldId desc12','query');
/*!40000 ALTER TABLE `tbdatasource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbdatasourcemapping`
--

DROP TABLE IF EXISTS `tbdatasourcemapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbdatasourcemapping` (
  `datasourceid` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `datatype` varchar(8) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`datasourceid`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbdatasourcemapping`
--

LOCK TABLES `tbdatasourcemapping` WRITE;
/*!40000 ALTER TABLE `tbdatasourcemapping` DISABLE KEYS */;
INSERT INTO `tbdatasourcemapping` VALUES (1,'acu',NULL,'平均在线',NULL),(1,'onlinetime ',NULL,'时间',''),(1,'pcu',NULL,'最高在线',NULL),(1,'serverId',NULL,'服务器',NULL),(4,'DayRate','string','日环比','null'),(4,'dtStatTime','date','时间','null'),(4,'iAllRegNum','null','总注册用户','null'),(4,'iDayRegNum','null','日新增注册用户','null'),(4,'WeekRate','string','周同比','null'),(6,'dtStatDate','date','时间','null'),(6,'iAllRegNum','int','总注册用户数','统计日之前总注册的UIN的数量，代表游戏被多少用户注册过；反映游戏的营销推广的效果。'),(6,'iDayActivityNum','int','日活跃人数','统计当日有过登陆的UIN的数量，持续的数据能够反映游戏的受欢迎程度，也是评价游戏品质的重要指标。'),(6,'iDayRegNum','int','日新增注册用户数','统计当日新增注册的UIN的数量，代表当天有多少新的用户注册过；反映当日游戏的营销推广的效果。'),(7,'dtStatDate','null','时间','null'),(7,'iWeekActivityNum','int','周活跃人数','当前日期往前推7天的活跃人数'),(7,'iWeekBackNum','int','周回流用户数','null'),(7,'iWeekLostNum','int','周流失用户数','null'),(7,'iWeekRegNum','int','周注册人数','当前日期往前推7天注册人数'),(8,'regtime',NULL,'注册时间',NULL),(8,'serverId',NULL,'服务器',NULL),(8,'usercount',NULL,'用户数',''),(8,'userlevel',NULL,'等级',NULL),(9,'activenum',NULL,'活跃人数',NULL),(9,'diffday',NULL,'留存天数','注册时间到登陆时间之天数'),(9,'logintime',NULL,'登陆日期','注册时间内注册的人在当前时间登陆'),(9,'lzper',NULL,'留存率','注册时间内的注册人在登陆时间内登陆的人数比'),(9,'regcount',NULL,'注册人数',NULL),(9,'serverId',NULL,'服务器',NULL),(11,'actiontime',NULL,'时间',NULL),(11,'serverId',NULL,'服务器',NULL),(12,'actiontime',NULL,'时间',NULL),(12,'serverId',NULL,'服务器',NULL),(13,'actiontime',NULL,'时间',NULL),(13,'serverId',NULL,'服务器',NULL),(14,'actiontime',NULL,'时间',NULL),(14,'serverId',NULL,'服务器',NULL),(15,'actiontime',NULL,'时间',NULL),(15,'beautynum',NULL,'美人数',NULL),(15,'beautyType',NULL,'美人',NULL),(15,'serverId',NULL,'服务器',NULL),(16,'actiontime',NULL,'时间',NULL),(16,'serverId',NULL,'服务器',NULL),(17,'gameLvId',NULL,'小关卡',NULL),(17,'gameMapId',NULL,'关卡',NULL),(17,'intimes',NULL,'进入关卡','指玩家首次通关此关前进入的次数'),(17,'passtimes',NULL,'首次通关','玩家第一次通关此关的次数'),(17,'serverId',NULL,'服务器',NULL),(20,'dtStatDate','date','时间','null'),(20,'iAllRegNum','int','总注册用户数','null'),(20,'iDayRegNum','int','日新增注册用户数','null'),(20,'iDWeekRegNum','int','双周新增注册用户数','null'),(20,'iMonthRegNum','int','月新增注册用户数','null'),(20,'iWeekRegNum','int','周新增注册用户数','null'),(22,'dtStatDate','null','dtStatDate','null'),(22,'iAllRegNum','int','总注册用户数','null'),(22,'iDayRegNum','int','日注册用户数','null'),(22,'iDWeekRegNum','int','双周注册用户数','null'),(22,'iMonthRegNum','int','月注册用户数','null'),(22,'iWeekRegNum','int','周注册用户数','null'),(24,'dtStatDate','null','时间','null'),(24,'iDayActivityNum','null','日活跃用户数','null'),(24,'iDMonthActivityNum','null','双月活跃用户数','null'),(24,'iDWeekActivityNum','null','双周活跃用户数','null'),(24,'iMonthActivityNum','null','月活跃用户数','null'),(24,'iWeekActivityNum','null','周活跃用户数','null'),(26,'dtRegDate','null','注册时间','null'),(26,'dtStatDate','null','统计时间','null'),(26,'iDayNum','null','注册后天数','null'),(26,'iUserNum','int','活跃用户数','null'),(26,'Rate','null','占比','null'),(27,'dtRegDate','null','注册日期','null'),(27,'dtStatDate','null','统计日期','null'),(27,'iDayNum','null','流失时间','在统计时间内，用户最后一次活跃的时间'),(27,'iUserNum','int','流失用户数','null'),(27,'Rate','float','流失率','null'),(29,'dtStatDate','null','统计时间','null'),(29,'iAllRegNum','int','总注册用户数','null'),(29,'iDayActivityNum','int','日活跃用户数','null'),(29,'iDayRegNum','int','日注册用户数','null'),(30,'dtStatDate','null','dtStatDate','null'),(30,'iDayActivityNum','int','日活跃用户数','null'),(30,'iDMonthActivityNum','int','双月活跃用户数','null'),(30,'iDWeekActivityNum','int','双周活跃用户数','null'),(30,'iMonthActivityNum','int','月活跃用户数','null'),(30,'iWeekActivityNum','int','周活跃用户数','null'),(31,'dtRegDate','null','注册日期','null'),(31,'dtStatDate','null','统计日期','null'),(31,'iDayNum','string','流失时间','null'),(31,'iUserNum','int','用户数','null'),(31,'Rate','string','流失率','null'),(32,'dtStatDate','null','统计时间','null'),(32,'iWeekActivityNum','int','周活跃用户数','null'),(32,'iWeekBackNum','int','周回流用户数','null'),(32,'iWeekLostNum','int','周流失用户数','null'),(32,'iWeekRegNum','int','周注册用户数','null'),(33,'dtStatDate','null','时间','null'),(33,'iDayActivityNum','int','日活跃用户数','null'),(33,'iDMonthActivityNum','int','双月活跃用户数','null'),(33,'iDWeekActivityNum','int','双周活跃用户数','null'),(33,'iMonthActivityNum','int','月活跃用户数','null'),(33,'iWeekActivityNum','int','周活跃用户数','null'),(33,'vLevel','null','等级','null'),(35,'iDayActivityNum','int','日活跃用户数','null'),(35,'iDMonthActivityNum','int','双月活跃用户数','null'),(35,'iDWeekActivityNum','int','双周活跃 用户数','null'),(35,'iMonthActivityNum','int','月活跃用户数','null'),(35,'iWeekActivityNum','int','周活跃用户数','null'),(35,'vLevel','string','iLevel','null'),(37,'dtStatDate','null','时间','null'),(37,'iActivityNum','int','用户数','null'),(37,'vActivityDays','int','活跃天数','null'),(38,'iActivityNum','int','用户数','null'),(38,'vActivityDays','string','iActivityDays','null'),(40,'dtStatDate',NULL,'时间',NULL),(40,'iDayActivityNum','int','日活跃用户数',NULL),(40,'iDWeekActivityNum','int','双周活跃用户数',NULL),(40,'iMonthActivityNum','int','月活跃用户数',NULL),(40,'iWeekActivityNum','int','周活跃用户数',NULL),(41,'dtStatDate','null','dtStatDate','null'),(41,'iDayActivityNum','int','日活跃用户数','null'),(41,'iDWeekActivityNum','int','双周活跃用户数','null'),(41,'iMonthActivityNum','int','月活跃用户数','null'),(41,'iWeekActivityNum','int','周活跃用户数','null'),(43,'dtStatDate',NULL,'时间',NULL),(43,'iDayActivityNum','int','日活跃用户数',NULL),(43,'iDWeekActivityNum','int','双周活跃用户数',NULL),(43,'iMonthActivityNum','int','月活跃用户数',NULL),(43,'iWeekActivityNum','int','周活跃用户数',NULL),(44,'dtStatDate','null','dtStatDate','null'),(44,'iDayActivityNum','int','日活跃用户数','null'),(44,'iDWeekActivityNum','int','双周活跃用户数','null'),(44,'iMonthActivityNum','int','月活跃用户数','null'),(44,'iWeekActivityNum','int','周活跃用户数','null'),(46,'dtStatDate','string','时间','null'),(46,'iSegmentNum','int','用户数','null'),(46,'vSegmentName','string','时长区间','null'),(47,'iSegmentNum','int','用户数','null'),(47,'vSegmentName','string','vSegmentName','null'),(49,'AvgOnlineTime','float','平均在线时长（分钟）','null'),(49,'dtStatDate','null','时间','null'),(49,'iOnlineNum','int','用户数','null'),(49,'iOnlineTime','int','在线时长（秒）','null'),(49,'vLevel','null','等级','null'),(50,'AvgOnlineTime','float','平均在线时长（分钟）','null'),(50,'iLevel','null','iLevel','null'),(52,'dtStatDate',NULL,'时间',NULL),(52,'iAllDepositorNum','int','总充值用户数',NULL),(52,'iDayDepositorNum','int','日充值用户数',NULL),(52,'iDWeekDepositorNum','int','双周充值用户数',NULL),(52,'iMonthDepositorNum','int','月充值用户数',NULL),(52,'iWeekDepositorNum','int','周充值用户数',NULL),(53,'dtStatDate','null','dtStatDate','null'),(53,'iDayDepositorNum','int','日充值用户数','null'),(53,'iDWeekDepositorNum','int','双周充值用户数','null'),(53,'iMonthDepositorNum','int','月充值用户数','null'),(53,'iWeekDepositorNum','int','周充值用户数','null'),(55,'dtStatDate',NULL,'时间',NULL),(55,'iDayNewDepositorNum','int','日新增充值用户',NULL),(55,'iDWeekNewDepositorNum','int','双周新增充值用户',NULL),(55,'iMonthNewDepositorNum','int','月新增充值用户',NULL),(55,'iWeekNewDepositorNum','int','周新增充值用户',NULL),(56,'dtStatDate','null','dtStatDate','null'),(56,'iDayNewDepositorNum','int','日新增充值用户','null'),(56,'iDWeekNewDepositorNum','int','双周新增充值用户','null'),(56,'iMonthNewDepositorNum','int','月新增充值用户','null'),(56,'iWeekNewDepositorNum','int','周新增充值用户','null'),(57,'dtStatDate','null','时间','null'),(57,'iAllPayNum','int','总消费用户数','null'),(57,'iDayPayNum','int','日消费用户数','null'),(57,'iDWeekPayNum','int','双周消费用户数',NULL),(57,'iMonthPayNum','int','月消费用户数',NULL),(57,'iWeekPayNum','int','周消费用户数',NULL),(59,'dtStatDate','null','dtStatDate','null'),(59,'iDayPayNum','int','日消费用户数','null'),(59,'iDWeekPayNum','int','双周消费用户数','null'),(59,'iMonthPayNum','int','月消费用户数','null'),(59,'iWeekPayNum','int','周消费用户数','null'),(61,'dtStatDate','null','时间','null'),(61,'iDayNewPayNum','int','日新增消费用户','null'),(61,'iDWeekNewPayNum','int','双周新增消费用户',NULL),(61,'iMonthNewPayNum','int','月新增消费用户',NULL),(61,'iWeekNewPayNum','int','周新增消费用户',NULL),(62,'dtStatDate','null','dtStatDate','null'),(62,'iDayNewPayNum','int','日新增消费用户','null'),(62,'iDWeekNewPayNum','int','双周新增消费用户','null'),(62,'iMonthNewPayNum','int','月新增消费用户','null'),(62,'iWeekNewPayNum','int','周新增消费用户','null'),(64,'dtStatDate','null','时间','null'),(64,'iDayNewPayNum','int','日新增消费用户','null'),(64,'iDWeekNewPayNum','int','双周新增消费用户','null'),(64,'iMonthNewPayNum','int','月新增消费用户','null'),(64,'iWeekNewPayNum','int','周新增消费用户','null'),(64,'vLevel','null','等级','null'),(65,'iDayNewPayNum','int','日新增消费用户','null'),(65,'iDWeekNewPayNum','int','双周新增消费用户','null'),(65,'iMonthNewPayNum','int','月新增消费用户','null'),(65,'iWeekNewPayNum','int','周新增消费用户','null'),(65,'vLevel','null','等级','null'),(66,'iDayNum','null','注册后时间','null'),(66,'iUserNum','int','用户数','null'),(66,'Rate','string','占比','null'),(70,'iDayActivityNum','int','日活跃用户',NULL),(70,'iDayRegNum','int','日新增注册用户',NULL);
/*!40000 ALTER TABLE `tbdatasourcemapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbgroup`
--

DROP TABLE IF EXISTS `tbgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupname` varchar(32) NOT NULL,
  `creater` varchar(255) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbgroup`
--

LOCK TABLES `tbgroup` WRITE;
/*!40000 ALTER TABLE `tbgroup` DISABLE KEYS */;
INSERT INTO `tbgroup` VALUES (1,'test','admin','2015-03-03 15:24:25'),(11,'axelisgroup21','admin','2015-04-18 16:57:44');
/*!40000 ALTER TABLE `tbgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbgroup_production`
--

DROP TABLE IF EXISTS `tbgroup_production`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbgroup_production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupid` int(11) NOT NULL,
  `productionid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  `creater` varchar(16) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbgroup_production`
--

LOCK TABLES `tbgroup_production` WRITE;
/*!40000 ALTER TABLE `tbgroup_production` DISABLE KEYS */;
INSERT INTO `tbgroup_production` VALUES (2,1,30,0,'admin','2015-03-10 13:07:49'),(3,2,1,0,'admin','2015-03-10 13:08:00'),(4,1,31,0,'admin','2015-03-10 13:07:49'),(83,11,31,1,'admin','2015-04-27 10:03:10'),(84,11,31,13,'admin','2015-04-27 10:03:10'),(85,11,31,14,'admin','2015-04-27 10:03:10'),(86,11,31,37,'admin','2015-04-27 10:03:10'),(87,11,31,44,'admin','2015-04-27 10:03:10'),(88,11,31,43,'admin','2015-04-27 10:03:10'),(89,11,31,40,'admin','2015-04-27 10:03:10'),(90,11,31,54,'admin','2015-04-27 10:03:10'),(91,11,31,51,'admin','2015-04-27 10:03:10'),(92,11,31,45,'admin','2015-04-27 10:03:10'),(93,11,31,46,'admin','2015-04-27 10:03:10'),(94,11,31,64,'admin','2015-04-27 10:03:10'),(95,11,31,57,'admin','2015-04-27 10:03:10'),(96,11,31,56,'admin','2015-04-27 10:03:10'),(97,11,31,60,'admin','2015-04-27 10:03:10'),(98,11,31,62,'admin','2015-04-27 10:03:10'),(99,11,31,59,'admin','2015-04-27 10:03:10'),(100,11,31,61,'admin','2015-04-27 10:03:10'),(101,11,31,63,'admin','2015-04-27 10:03:10');
/*!40000 ALTER TABLE `tbgroup_production` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbmenu`
--

DROP TABLE IF EXISTS `tbmenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbmenu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  `relegation` smallint(6) DEFAULT NULL,
  `relegationid` int(11) DEFAULT NULL,
  `pageid` int(11) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbmenu`
--

LOCK TABLES `tbmenu` WRITE;
/*!40000 ALTER TABLE `tbmenu` DISABLE KEYS */;
INSERT INTO `tbmenu` VALUES (1,'首页',2,1,1,1,0),(3,'用户分析',6,1,1,0,0),(4,'特性',2,0,1,0,0),(5,'实时数据',4,1,1,0,0),(13,'用户当日总况',2,1,1,4,3),(14,'用户周总况',4,1,1,5,3),(19,'新手流程监控',1,0,1,NULL,-1),(20,'资源类',0,0,1,NULL,4),(21,'钻石产出消耗\r\n',3,0,1,10,28),(22,'美人',2,0,1,NULL,2),(23,'美人召唤次数',1,0,1,11,22),(24,'美人等级分布',2,0,1,12,22),(25,'装备',1,0,1,NULL,4),(26,'装备等级分布',4,0,1,13,28),(27,'装备阶数分布',2,0,1,14,25),(28,'关卡',2,0,1,NULL,4),(29,'首次通关情况',1,0,1,15,0),(37,'新增注册用户',6,1,1,22,3),(38,'特性',0,0,31,0,0),(40,'活跃用户数',12,1,1,23,3),(41,'测试11',0,1,2,0,0),(43,'注册用户活跃跟踪',10,1,1,24,3),(44,'注册用户流失跟踪',8,1,1,25,3),(45,'活跃用户等级分布',18,1,1,26,3),(46,'月活跃用户活跃度分布',20,1,1,27,3),(51,'消费用户活跃情况',16,1,1,28,3),(54,'非消费用户活跃情况',14,1,1,29,3),(55,'在线分析',8,1,1,0,0),(56,'在线时长分布',0,1,1,30,55),(57,'在线时长等级分布',0,1,1,31,55),(58,'付费用户',10,1,1,0,0),(59,'充值活跃情况',5,1,1,32,58),(60,'新增充值用户',1,1,1,33,58),(61,'消费活跃情况',9,1,1,34,58),(62,'新增消费用户',3,1,1,35,58),(63,'新增消费用户等级分布',10,1,1,36,58),(64,'实时在线',0,1,1,37,5),(70,'恩恩',0,1,2,0,41),(71,'嗯嗯嗯123',0,1,2,0,0),(72,'测试标题',0,1,2,38,70),(73,'我来新建页面',NULL,1,2,40,71);
/*!40000 ALTER TABLE `tbmenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbpageconfig`
--

DROP TABLE IF EXISTS `tbpageconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbpageconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT NULL,
  `creater` varchar(16) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbpageconfig`
--

LOCK TABLES `tbpageconfig` WRITE;
/*!40000 ALTER TABLE `tbpageconfig` DISABLE KEYS */;
INSERT INTO `tbpageconfig` VALUES (1,'首页','admin','2014-05-25 14:19:07'),(2,'PCU&ACU','admin','2014-06-03 20:06:17'),(3,'注册人数','admin','2014-06-04 11:04:56'),(4,'用户当日总况','admin','2014-06-04 15:39:47'),(5,'用户周总况','admin','2014-06-04 20:08:40'),(6,'下载安装率','admin','2014-06-04 23:24:56'),(7,'新注册用户当日等级分布','admin','2014-06-04 23:26:16'),(8,'新注册用户留存（90天）','admin','2014-06-05 15:33:15'),(9,'总注册用户等级分布情况','admin','2014-06-06 13:19:43'),(10,'钻石的产出消耗渠道','admin','2014-06-07 17:42:04'),(11,'美人的数量','admin','2014-06-07 17:42:42'),(12,'美人等级分布情况','admin','2014-06-07 17:43:03'),(13,'装备的等级分布','admin','2014-06-07 17:43:32'),(14,'装备的阶数分布','admin','2014-06-07 17:43:58'),(15,'首次通关情况','admin','2014-06-07 17:44:25'),(16,'',NULL,NULL),(17,'',NULL,NULL),(18,'testtt',NULL,NULL),(19,'dgdgdsg',NULL,NULL),(20,'sdfasfa',NULL,NULL),(21,'bbbbbbbbb',NULL,NULL),(22,'新增注册用户',NULL,NULL),(23,'活跃用户数',NULL,NULL),(24,'注册活跃跟踪',NULL,NULL),(25,'注册用户流失跟踪',NULL,NULL),(26,'活跃用户等级分布',NULL,NULL),(27,'月活跃用户活跃度分布',NULL,NULL),(28,'消费用户活跃情况',NULL,NULL),(29,'非消费用户活跃情况',NULL,NULL),(30,'在线时长分布',NULL,NULL),(31,'在线时长等级分布',NULL,NULL),(32,'充值活跃情况',NULL,NULL),(33,'新增充值用户',NULL,NULL),(34,'消费活跃情况',NULL,NULL),(35,'新增消费用户',NULL,NULL),(36,'新增消费用户等级分布',NULL,NULL),(37,'实时在线',NULL,NULL),(38,'测试标题',NULL,NULL),(39,'undefined','admin','2015-04-28 15:04:15'),(40,'我来新建页面','admin','2015-04-28 15:50:03');
/*!40000 ALTER TABLE `tbpageconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbproduction`
--

DROP TABLE IF EXISTS `tbproduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbproduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(16) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `image` varchar(32) DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `reportframeworkid` int(11) DEFAULT NULL,
  `creater` varchar(16) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbproduction`
--

LOCK TABLES `tbproduction` WRITE;
/*!40000 ALTER TABLE `tbproduction` DISABLE KEYS */;
INSERT INTO `tbproduction` VALUES (1,'jm','测试业务1',NULL,0,1,'fefeding','2014-04-01 19:17:59'),(29,'jm1','我的业务',NULL,NULL,1,NULL,'2014-06-01 23:18:20'),(30,'test2','test2',NULL,0,1,NULL,'2014-07-20 23:30:46'),(31,'dj','大剑',NULL,1,1,NULL,'2014-12-31 13:04:18'),(32,'aaaaaaaaaaaa','axelsi','1429674625984.png',1,1,'admin','2015-04-21 11:28:36'),(33,'0','新表',NULL,0,0,'admin','2015-04-23 15:04:14');
/*!40000 ALTER TABLE `tbproduction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbreportconfig`
--

DROP TABLE IF EXISTS `tbreportconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbreportconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT NULL,
  `pageid` int(11) DEFAULT NULL,
  `templateid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbreportconfig`
--

LOCK TABLES `tbreportconfig` WRITE;
/*!40000 ALTER TABLE `tbreportconfig` DISABLE KEYS */;
INSERT INTO `tbreportconfig` VALUES (1,'首页',1,1),(2,'PCU&ACU',2,1),(3,'注册人数',3,1),(4,'当日总况',4,1),(5,'用户周注册和活跃人数',5,1),(6,'下载安装率',6,1),(7,'新注册用户当日等级分布',7,1),(8,'新注册用户留存（90天）',8,1),(9,'总注册用户等级分布情况',9,1),(10,'钻石的产出消耗渠道',10,1),(11,'美人如召次数',11,1),(12,'装备等级分布',13,1),(13,'美人等级分布',12,1),(14,'装备阶数分布',14,1),(15,'首次通关情况',15,1),(16,NULL,16,1),(17,NULL,17,1),(18,NULL,18,1),(19,NULL,19,1),(20,NULL,20,1),(21,NULL,21,2),(22,NULL,22,1),(23,NULL,23,1),(24,NULL,24,1),(25,NULL,25,1),(26,NULL,26,1),(27,NULL,27,1),(28,NULL,28,1),(29,NULL,29,1),(30,NULL,30,1),(31,NULL,31,1),(32,NULL,32,1),(33,NULL,33,1),(34,NULL,34,1),(35,NULL,35,1),(36,NULL,36,1),(37,NULL,37,3),(38,NULL,38,1),(39,'undefined',39,2),(40,'我来新建页面',73,2);
/*!40000 ALTER TABLE `tbreportconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbreportcontrolconfig`
--

DROP TABLE IF EXISTS `tbreportcontrolconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbreportcontrolconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reportid` int(11) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `controlname` varchar(32) DEFAULT NULL,
  `controlindex` smallint(6) DEFAULT NULL,
  `controlconfig` varchar(2048) DEFAULT NULL,
  `dataserverlabel` varchar(32) DEFAULT NULL,
  `datasourceid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbreportcontrolconfig`
--

LOCK TABLES `tbreportcontrolconfig` WRITE;
/*!40000 ALTER TABLE `tbreportcontrolconfig` DISABLE KEYS */;
INSERT INTO `tbreportcontrolconfig` VALUES (1,2,'最高在线和平均在线','GridViewData',0,'{\"pageSize\":0}','frameworktlog',1),(2,1,'关键运营信息','OneTextItemCompareList',0,'{\n\"xUnit\": \"\"\n}','dbResult',4),(3,3,'注册人数','JMChart',0,'{\r\n\"interval\": 0,\r\n\"logic\": [{\"name\": \"DataToDayColumnHourRow\"}],\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": false}],\r\n\"xTitle\": \"小时\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"注册人数\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"yyyy-MM-dd\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": false\r\n}','frameworktlog',5),(4,4,'用户当日总况','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',6),(5,5,'用户周总况','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',7),(6,7,'新注册用户当日等级分布人数','GridViewData',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"regtime\"],\r\n\"toColumn\":\"userlevel\",\r\n\"subColumns\":[\"usercount\"]\r\n}]\r\n}','frameworktlog',8),(7,8,'新注册用户留存（90天）','GridViewData',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"diffday\"],\r\n\"toColumn\":\"regtime\",\r\n\"subColumns\":[\"regcount\",\"activenum\",\"lzper\"]\r\n}]\r\n}','frameworktlog',9),(8,9,'总注册用户等级分布情况','JMChart',0,'{\r\n\"interval\": 0,\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"userlevel\"],\r\n\"toColumn\":\"serverId\",\r\n\"subColumns\":[\"usercount\"]\r\n}],\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\r\n\"xTitle\": \"等级\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"人数\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": true\r\n}','frameworktlog',10),(9,10,'产出','GridViewData',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"actiontime\"],\r\n\"toColumn\":\"displayname\",\r\n\"subColumns\":[\"changenum\"]\r\n}]\r\n}','frameworktlog',11),(10,10,'消耗','GridViewData',1,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"actiontime\"],\r\n\"toColumn\":\"displayname\",\r\n\"subColumns\":[\"changenum\"]\r\n}]\r\n}','frameworktlog',12),(11,11,'游戏中美人的数量','GridViewData',1,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"actiontime\"],\r\n\"toColumn\":\"beautyname\",\r\n\"subColumns\":[\"beautynum\"]\r\n}]\r\n}','frameworktlog',13),(12,12,'装备等级分布','JMChart',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"iequiplv\"],\r\n\"toColumn\":\"serverId\",\r\n\"subColumns\":[\"equipcount\"]\r\n}],\r\n\"interval\": 0,\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"column\",\"pointMark\":true,\"label\":true,\"animation\": true}],\r\n\"xTitle\": \"装备等级\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"装备数量\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"yyyy-MM-dd\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": true\r\n}\r\n','frameworktlog',14),(13,13,'美人等级分布','GridViewData',1,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"actiontime\"],\r\n\"toColumn\":\"beautystar/beautylvl\",\r\n\"subColumns\":[\"beautynum\"]\r\n}]\r\n}','frameworktlog',15),(14,14,'装备阶数分布','JMChart',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"iequipclass\"],\r\n\"toColumn\":\"serverId\",\r\n\"subColumns\":[\"equipcount\"]\r\n}],\r\n\"interval\": 0,\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"column\",\"pointMark\":true,\"label\":true,\"animation\": true}],\r\n\"xTitle\": \"装备阶数\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"装备数量\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"yyyy-MM-dd\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": true\r\n}\r\n','frameworktlog',16),(15,15,'首次通关情况','GridViewData',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"serverId\",\"gameMapId\",\"gameLvId\"],\r\n\"toColumn\":\"gameRank\",\r\n\"subColumns\":[\"intimes\",\"passtimes\"]\r\n}]\r\n}','frameworktlog',17),(16,11,'美人数量分布','JMChart',0,'{\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"beautyType\"],\r\n\"toColumn\":\"serverId\",\r\n\"subColumns\":[\"beautynum\"]\r\n}],\r\n\"interval\": 0,\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"column\",\"pointMark\":true,\"label\":true,\"animation\": true}],\r\n\"xTitle\": \"美人\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"美人数量\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"yyyy-MM-dd\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": true\r\n}','frameworktlog',18),(17,13,'美人等级分布','JMChart',0,'{\r\n\"interval\": 0,\r\n\"logic\": [{\r\n\"name\": \"RowToColumn\",\r\n\"keys\":[\"beautyLvl\"],\r\n\"toColumn\":\"beautystar\",\r\n\"subColumns\":[\"beautynum\"]\r\n}],\r\n\"height\": 0,\r\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\r\n\"xTitle\": \"美人等级\",\r\n\"isAxis2Y\": 0,\r\n\"yTitle\": \"美人数量\",\r\n\"y2Title\": \"\",\r\n\"yMin\": 0,\r\n\"xFormat\": \"\",\r\n\"xRotation\": 0,\r\n\"legendPosition\": \"right\",\r\n\"animation\": true\r\n}','frameworktlog',19),(18,16,'teste','JMChart',0,'','frameworkconfig',0),(19,16,'bbbb','JMChart',1,'',NULL,0),(20,17,'bvnvbn','JMChart',0,'kjhkhkhk','frameworkconfig',0),(21,17,'rrerty','JMChart',1,NULL,NULL,0),(22,15,'','JMChart',1,NULL,NULL,0),(23,18,'test','JMChart',0,'',NULL,0),(24,18,'aaaa','JMChart',1,'',NULL,0),(25,19,'','JMChart',0,NULL,NULL,0),(26,19,'','JMChart',1,NULL,NULL,0),(27,20,'','JMChart',0,NULL,NULL,0),(28,20,'','JMChart',1,NULL,NULL,0),(29,21,'nnn','JMChart',0,'',NULL,0),(30,21,'','JMChart',1,NULL,NULL,0),(31,21,'','JMChart',2,NULL,NULL,0),(32,21,'','JMChart',3,NULL,NULL,0),(34,4,'用户当日总况','GridViewData',1,NULL,'dbResult',29),(35,22,'日新增注册用户数','JMChart',0,'{\n\"interval\": 5,\n\"logic\": [{\"name\": \"DataToDayColumnHourRow\"}],\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": false}],\n\"xTitle\": \"日期\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"yyyy-MM-dd\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": false\n}','dbResult',22),(36,22,'新增注册用户','GridViewData',1,NULL,'dbResult',20),(37,5,'用户周总况','GridViewData',1,NULL,'dbResult',32),(38,23,'活跃用户数','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"人数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',24),(39,24,'注册活跃跟踪','JMChart',0,'{\n\"interval\": 0,\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"iDayNum\"],\n\"toColumn\":\"dtRegDate\",\n\"subColumns\":[\"iUserNum\"]\n}],\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',26),(40,24,'注册用户活跃跟踪','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"iDayNum\"],\n\"toColumn\":\"dtRegDate\",\n\"subColumns\":[\"iUserNum\",\"Rate\"]\n}]\n}','dbResult',66),(41,25,'注册用户流失跟踪','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',27),(42,25,'注册用户流失跟踪','GridViewData',1,NULL,'dbResult',31),(43,23,'活跃用户数','GridViewData',1,'','dbResult',30),(44,26,'活跃用户等级分布','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"等级\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',35),(45,26,'活跃用户等级分布','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatDate\"],\n\"toColumn\":\"vLevel\",\n\"subColumns\":[\"iDayActivityNum\",\"iWeekActivityNum\",\"iDWeekActivityNum\",\"iMonthActivityNum\",\"iDMonthActivityNum\"]\n}]\n}','dbResult',33),(46,27,'月活跃用户活跃度分布','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"pie\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"活跃天数\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',38),(47,27,'月活跃用户活跃度分布','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatDate\"],\n\"toColumn\":\"vActivityDays\",\n\"subColumns\":[\"iActivityNum\"]\n}]\n}','dbResult',37),(48,28,'消费用户活跃情况','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',41),(49,28,'消费用户活跃情况','GridViewData',1,NULL,'dbResult',40),(50,29,'非消费用户活跃情况','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',44),(51,29,'非消费用户活跃情况','GridViewData',1,NULL,'dbResult',43),(52,30,'在线时长分布','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"pie\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"活跃天数\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',47),(53,30,'在线时长分布','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatDate\"],\n\"toColumn\":\"vSegmentName\",\n\"subColumns\":[\"iSegmentNum\"]\n}]\n}','dbResult',46),(54,31,'在线时长等级分布','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"用户等级\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"平均在线时长（分钟）\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',50),(55,31,'在线时长等级分布','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatDate\"],\n\"toColumn\":\"vLevel\",\n\"subColumns\":[\"iOnlineNum\",\"iOnlineTime\",\"AvgOnlineTime\"]\n}]\n}','dbResult',49),(56,32,'充值活跃情况','JMChart',0,'{\n\"interval\": 0,\n\"logic\": [{\n\"name\": \"\",\n\"keys\":[\"userlevel\"],\n\"toColumn\":\"serverId\",\n\"subColumns\":[\"usercount\"]\n}],\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',53),(57,32,'充值用户数','GridViewData',1,NULL,'dbResult',52),(58,33,'新增充值用户','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',56),(59,33,'新增充值用户','GridViewData',1,NULL,'dbResult',55),(60,34,'消费活跃情况','JMChart',0,'{\n\"interval\": 0,\n\"logic\": [{\n\"name\": \"\",\n\"keys\":[\"userlevel\"],\n\"toColumn\":\"serverId\",\n\"subColumns\":[\"usercount\"]\n}],\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',59),(61,34,'消费用户数','GridViewData',1,NULL,'dbResult',57),(62,35,'新增消费用户','JMChart',0,'{\n\"interval\": 0,\n\"logic\": [{\n\"name\": \"\",\n\"keys\":[\"userlevel\"],\n\"toColumn\":\"serverId\",\n\"subColumns\":[\"usercount\"]\n}],\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',62),(63,35,'新增消费用户','GridViewData',1,NULL,'dbResult',61),(64,36,'日新增消费用户等级分布','JMChart',0,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"column\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"等级\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',65),(65,36,'新增消费用户等级分布','GridViewData',1,'{\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatDate\"],\n\"toColumn\":\"vLevel\",\n\"subColumns\":[\"iDayNewPayNum\",\"iWeekNewPayNum\",\"iDWeekNewPayNum\",\"iMonthNewPayNum\"]\n}]\n}','dbResult',64),(68,37,'实时在线','JMChart',0,'{\n\"interval\": 200,\n\"logic\": [{\n\"name\": \"RowToColumn\",\n\"keys\":[\"dtStatTime\"],\n\"toColumn\":\"Name\",\n\"subColumns\":[\"iUserNum\"]\n}],\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"用户数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"HH:mm\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',68),(71,1,'日新增注册和日活跃用户','JMChart',1,'{\n\"interval\": 0,\n\"height\": 0,\n\"series\": [{\"type\":\"line\",\"pointMark\":false,\"label\":false,\"animation\": true}],\n\"xTitle\": \"时间\",\n\"isAxis2Y\": 0,\n\"yTitle\": \"人数\",\n\"y2Title\": \"\",\n\"yMin\": 0,\n\"xFormat\": \"\",\n\"xRotation\": 0,\n\"legendPosition\": \"right\",\n\"animation\": true\n}','dbResult',70),(72,38,'','JMChart',0,NULL,NULL,0),(73,38,'','JMChart',1,NULL,NULL,0);
/*!40000 ALTER TABLE `tbreportcontrolconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbreportframework`
--

DROP TABLE IF EXISTS `tbreportframework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbreportframework` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayname` varchar(32) DEFAULT NULL,
  `creater` varchar(16) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbreportframework`
--

LOCK TABLES `tbreportframework` WRITE;
/*!40000 ALTER TABLE `tbreportframework` DISABLE KEYS */;
INSERT INTO `tbreportframework` VALUES (1,'经分框架',NULL,'2014-12-31 14:00:40'),(2,'测试',NULL,'2015-01-05 18:21:12');
/*!40000 ALTER TABLE `tbreportframework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbreporttemplate`
--

DROP TABLE IF EXISTS `tbreporttemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbreporttemplate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `templatename` varchar(32) DEFAULT NULL,
  `content` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbreporttemplate`
--

LOCK TABLES `tbreporttemplate` WRITE;
/*!40000 ALTER TABLE `tbreporttemplate` DISABLE KEYS */;
INSERT INTO `tbreporttemplate` VALUES (1,'测试模板','[\r\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":0}],\r\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":1}]\r\n]'),(2,'田字模板','[\r\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":0},{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":1}],\r\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":2},{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":3}]\r\n]'),(3,'单控件模板','[\r\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":0}]\r\n]'),(4,'上二下一','[\n[{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":0},{\"colspan\":1,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":1}],\n[{\"colspan\":2,\"rowspan\":1,\"width\":0,\"height\":0,\"index\":2}]\n]');
/*!40000 ALTER TABLE `tbreporttemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbtoolbarcontrolconfig`
--

DROP TABLE IF EXISTS `tbtoolbarcontrolconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbtoolbarcontrolconfig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageid` int(11) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `controlname` varchar(32) DEFAULT NULL,
  `label` varchar(16) DEFAULT NULL,
  `defaultvalue` varchar(32) DEFAULT NULL,
  `dataserverlabel` varchar(32) DEFAULT NULL,
  `datasourceid` int(11) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbtoolbarcontrolconfig`
--

LOCK TABLES `tbtoolbarcontrolconfig` WRITE;
/*!40000 ALTER TABLE `tbtoolbarcontrolconfig` DISABLE KEYS */;
INSERT INTO `tbtoolbarcontrolconfig` VALUES (1,1,'时间','DateTimeOne','end','D-1',NULL,0,0),(2,1,'服务器','ComboBoxOne','world','-1','dbConf',3,0),(3,2,'时间','DateTimeTwo','start;end','D-14;D-1',NULL,NULL,NULL),(4,2,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(5,3,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,NULL,NULL),(6,3,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(7,4,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(9,5,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(11,7,'时间','DateTimeTwo','start;end','D-30;D-1',NULL,NULL,NULL),(12,7,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(13,8,'时间','DateTimeTwo','start;end','D-20;D-16',NULL,NULL,NULL),(14,8,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(15,9,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(16,10,'时间','DateTimeTwo','start;end','D-30;D-1',NULL,NULL,NULL),(17,10,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(18,11,'时间','DateTimeTwo','start;end','D-15;D-1',NULL,NULL,NULL),(19,11,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(21,13,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(22,12,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(23,12,'时间','DateTimeTwo','start;end','D-30;D-1',NULL,NULL,NULL),(24,14,'时间','DateTimeTwo','start;end','D-14;D-1',NULL,NULL,NULL),(25,14,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,NULL),(26,15,'时间','DateTimeTwo','start;end','D-14;D-1',NULL,0,0),(27,15,'服务器','ComboBoxOne','world','-1','frameworkconfig',3,0),(28,13,'时间','DateTimeTwo','start;end','D-30;D-1',NULL,NULL,NULL),(29,16,'tes','TextBox','te',NULL,NULL,0,0),(30,17,'dsgsd','TextBox','dsfgds',NULL,NULL,0,0),(31,18,'test','TextBox','sfsad',NULL,NULL,0,0),(32,21,'eeeeeeeeeee','TextBox','rrrrr',NULL,NULL,0,0),(33,22,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,21,0),(34,23,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(35,23,'服务器','ComboBoxOne','world',NULL,'dbConf',23,0),(36,24,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(37,24,'服务器','ComboBoxOne','world',NULL,'dbConf',25,0),(38,25,'注册时间','DateTimeOne','start','D-7',NULL,0,0),(39,25,'统计时间','CheckBoxList','end','D-1','dbResult',NULL,0),(40,25,'服务器','ComboBoxOne','world',NULL,'dbConf',28,0),(41,26,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(42,26,'服务器','ComboBoxOne','world',NULL,'dbConf',34,0),(43,27,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(44,27,'服务器','ComboBoxOne','world',NULL,'dbConf',36,0),(45,28,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(46,28,'服务器','ComboBoxOne','world',NULL,'dbConf',39,0),(47,29,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(48,29,'服务器','ComboBoxOne','world',NULL,'dbConf',42,0),(49,30,'时间','DateTimeTwo','start;end','D-1;D-1',NULL,0,0),(50,30,'服务器','ComboBoxOne','world',NULL,'dbConf',45,0),(51,31,'时间','DateTimeTwo','start;end','D-1;D-1',NULL,0,0),(52,31,'服务器','ComboBoxOne','world',NULL,'dbConf',48,0),(53,32,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(54,32,'服务器','ComboBoxOne','world',NULL,'dbConf',51,0),(55,33,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(56,33,'服务器','ComboBoxOne','world',NULL,'dbConf',54,0),(57,34,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(58,34,'服务器','ComboBoxOne','world',NULL,'dbConf',58,0),(59,35,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(60,35,'服务器','ComboBoxOne','world',NULL,'dbConf',60,0),(61,36,'时间','DateTimeTwo','start;end','D-7;D-1',NULL,0,0),(62,36,'服务器','ComboBoxOne','world',NULL,'dbConf',63,0),(64,37,'时间','DateTimeOne','end','D',NULL,0,0),(65,37,'服务器','ComboBoxOne','world',NULL,'dbConf',69,0),(66,38,'时间','CheckBoxList','str','0','dbResult',NULL,0),(67,40,'服务器1','CheckBoxList','world1','1','dbResult',73,NULL),(68,40,'服务器2','CheckBoxList','world2','','dbResult',1,NULL);
/*!40000 ALTER TABLE `tbtoolbarcontrolconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbuser`
--

DROP TABLE IF EXISTS `tbuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(16) DEFAULT NULL,
  `nickname` varchar(16) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `creater` varchar(32) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbuser`
--

LOCK TABLES `tbuser` WRITE;
/*!40000 ALTER TABLE `tbuser` DISABLE KEYS */;
INSERT INTO `tbuser` VALUES (1,'admin','管理员','E10ADC3949BA59ABBE56E057F20F883E','admin','2014-05-31 23:09:26'),(32,'noyce','noyce','E10ADC3949BA59ABBE56E057F20F883E','admin','2015-04-18 15:21:03'),(33,'axelis','zjs111','E10ADC3949BA59ABBE56E057F20F883E','admin','2015-04-18 16:02:32');
/*!40000 ALTER TABLE `tbuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbuser_group`
--

DROP TABLE IF EXISTS `tbuser_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbuser_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupid` int(11) NOT NULL,
  `account` varchar(16) NOT NULL,
  `creater` varchar(16) DEFAULT NULL,
  `createon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbuser_group`
--

LOCK TABLES `tbuser_group` WRITE;
/*!40000 ALTER TABLE `tbuser_group` DISABLE KEYS */;
INSERT INTO `tbuser_group` VALUES (2,1,'test','admin','2015-03-06 20:34:30'),(65,11,'axelis','admin','2015-04-18 17:00:01'),(66,11,'admin','admin','2015-04-18 18:23:28'),(67,11,'noyce','admin','2015-04-27 10:02:42');
/*!40000 ALTER TABLE `tbuser_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-05-04 14:51:32
