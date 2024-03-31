// 引入AngularJS模块
let optionsApp = angular.module('whiteListTableApp', []);
// 定义控制器
optionsApp.controller('whiteListTableController', ['$scope', '$document', 'chromeStorage', 'tools', function ($scope, $document, chromeStorage, tools) {
    const whiteList = [];
    $scope.domains = whiteList;

    // 显示错误信息
    $scope.showErrMsg = function (str) {
        $scope.isVisible = true;
        $scope.errMsg = str;
    }

    // 初始化数据表格
    chromeStorage.get('whiteList', function (result) {
        if (result) {
            console.log("init whiteList: " + JSON.stringify(result))
            $scope.domains = result;
            $scope.$apply();
        } else {
            console.log("init whiteList: null")
        }
    });

    // 监听数据变化，并重新渲染表格
    chromeStorage.listen('whiteList', function (changes) {
        $scope.$apply(function () {
            $scope.domains = changes.newValue;
        });
    });

    // 添加新行
    $scope.addNewRow = function () {
        if (!$scope.newDomain) {
            $scope.showErrMsg('请输入域名');
            return;
        }

        if (!tools.validateHostname($scope.newDomain)) {
            $scope.showErrMsg('域名格式不正确. 示例: example.com | a.example.com');
            $scope.newDomain = '';
            return;
        }

        if ($scope.domains.indexOf($scope.newDomain) !== -1) {
            $scope.showErrMsg('域名已存在.');
            $scope.newDomain = '';
            return;
        }

        $scope.domains.push($scope.newDomain);
        chromeStorage.set('whiteList', $scope.domains);
        $scope.newDomain = '';

        // 隐藏错误信息元素
        $scope.isVisible = false;
    };

    // 删除行
    $scope.deleteRow = function (domain) {
        var index = $scope.domains.indexOf(domain);
        $scope.domains.splice(index, 1);
        chromeStorage.set('whiteList', $scope.domains);
    };

    // 添加按钮绑定回车键快捷键
    $document.bind('keydown', function (event) {
        console.log(event.code);
        if (event.code == 'Enter') {
            $scope.addNewRow();
        }
    });

}]);

// 封装Chrome存储服务方法
optionsApp.service('chromeStorage', function () {
    // 获取数据
    this.get = function (key, callback) {
        chrome.storage.sync.get(key, function (result) {
            callback(result[key]);
        });
    };

    // 保存数据
    this.set = function (key, value) {
        chrome.storage.sync.set({ [key]: value }, function () {
            console.log('set storage: ' + key + ' ' + value);
        });
    };

    // 监听数据变化
    this.listen = function (key, callback) {
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'sync' && changes.hasOwnProperty(key)) {
                callback(changes[key]);
            }
        });
    };
});


// 自定义工具类
optionsApp.service('tools', function () {
    this.validateHostname = function (hostname) {
        // 校验hostname是否符合要求的正则表达式
        var regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        return regex.test(hostname);
    }
});