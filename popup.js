// 引入AngularJS模块
let app = angular.module('popupApp', ['whiteListTableApp']);
// 定义控制器
app.controller('popupController', ['$scope', '$document', 'chromeStorage', 'chromeTabs', 'tools', function ($scope, $document, chromeStorage, chromeTabs, tools) {
    $scope.domains = [];
    $scope.hostname = '';

    // 获取当前页面的域名
    chromeTabs.getHostname(function (hostname) {
        $scope.$apply(function () {
            $scope.hostname = hostname;
            $scope.domainInput = $scope.hostname;
        });
    });

    // 获取域名白名单
    chromeStorage.get('whiteList', function (result) {
        if (result) {
            $scope.domains = result;
            $scope.$apply();
        }
    });

    // 添加域名
    $scope.addNewRow = function () {
        if (!$scope.domainInput) {
            $scope.showErrMsg('请输入域名');
            return;
        }

        if (!tools.validateHostname($scope.domainInput)) {
            $scope.showErrMsg('域名格式不正确. 示例: example.com | a.example.com');
            $scope.domainInput = '';
            return;
        }

        if ($scope.domains.indexOf($scope.domainInput) !== -1) {
            $scope.showErrMsg('域名已存在.');
            $scope.domainInput = '';
            return;
        }

        $scope.domains.push($scope.domainInput);
        chromeStorage.set('whiteList', $scope.domains);
        $scope.domainInput = '';
        $scope.showSuccessMsg('添加成功，请重新刷新页面.');

        $scope.isVisible = true;
    };

    // 显示成功的消息
    $scope.showSuccessMsg = function (msg) {
        $scope.msg = msg;
        $scope.isSuccess = true;
        $scope.isVisible = true;
    };

    // 显示错误的消息
    $scope.showErrMsg = function (msg) {
        $scope.msg = msg;
        $scope.isDanger = true;
        $scope.isVisible = true;
    };

}]);


// 自定义工具类
app.service('chromeTabs', function () {
    this.getHostname = function (callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const hostname = new URL(tabs[0].url).hostname;
            callback(hostname);
        });
    }
});
