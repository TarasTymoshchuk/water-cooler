import template from './dashboard.tmpl.html';
import './dashboard.scss';

const DashboardComponent = {
  $name: 'dashboardComponent',
  selector: 'dashboard',
  templateUrl: template,
  bindings: {
    config: '='
  },
  controller: DashboardCtrl,
  controllerAs: 'vm'
};

export default DashboardComponent;

/* @ngInject */
function DashboardCtrl($log, $http, $timeout) {
  const vm = this;
  vm.show = true;

  vm.getData = () => {
    $http.get('https://fkgcx8b7kd.execute-api.eu-west-1.amazonaws.com/prod/getSmartCoolerState').then((response) => {
      vm.temp1 = response.data.temp1;
      vm.temp2 = response.data.temp2;
      vm.weight = response.data.weight;
      vm.litres = vm.weight * 0.189;
      vm.temp1Int = parseInt(vm.temp1, 10);
      vm.temp1Float =
          Math.ceil(((vm.temp1 < 1.0) ? vm.temp1 : (vm.temp1 % Math.floor(vm.temp1))) * 10000).toString()[0];
      vm.temp2Int = parseInt(vm.temp2, 10);
      vm.temp2Float =
          Math.ceil(((vm.temp2 < 1.0) ? vm.temp2 : (vm.temp2 % Math.floor(vm.temp2))) * 10000).toString()[0];
      vm.show = false;
      if (vm.weight < 0) vm.weight = 0;
    }).catch((error) => {
      vm.error = error;
      $log.log('ERROR!', error);
    });
  };
  vm.getData();

  vm.intervalFunction = () => {
    $timeout(() => {
      vm.getData();
      vm.intervalFunction();
    }, 10000);
  };
  vm.intervalFunction();

}
