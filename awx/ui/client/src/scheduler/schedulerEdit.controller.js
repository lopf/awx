export default ['$compile', '$state', '$stateParams', 'EditSchedule', 'Wait', '$scope', '$rootScope', 'CreateSelect2', 'ParseTypeChange', function($compile, $state, $stateParams, EditSchedule, Wait, $scope, $rootScope, CreateSelect2, ParseTypeChange) {
    $scope.$on("ScheduleFormCreated", function(e, scope) {
        $scope.hideForm = false;
        $scope = angular.extend($scope, scope);

        $scope.$on("formUpdated", function() {
            $rootScope.$broadcast("loadSchedulerDetailPane");
        });

        $scope.$watchGroup(["schedulerName",
            "schedulerStartDt",
            "schedulerStartHour",
            "schedulerStartMinute",
            "schedulerStartSecond",
            "schedulerTimeZone",
            "schedulerFrequency",
            "schedulerInterval",
            "monthlyRepeatOption",
            "monthDay",
            "monthlyOccurrence",
            "monthlyWeekDay",
            "yearlyRepeatOption",
            "yearlyMonth",
            "yearlyMonthDay",
            "yearlyOccurrence",
            "yearlyWeekDay",
            "yearlyOtherMonth",
            "schedulerEnd",
            "schedulerOccurrenceCount",
            "schedulerEndDt"
        ], function() {
            $scope.$emit("formUpdated");
        }, true);

        $scope.$watch("weekDays", function() {
            $scope.$emit("formUpdated");
        }, true);

        $rootScope.$broadcast("loadSchedulerDetailPane");
        Wait('stop');
    });

    $scope.isEdit = true;
    $scope.hideForm = true;
    $scope.parseType = 'yaml';

    $scope.formCancel = function() {
        $state.go("^");
    }

    $scope.$on('ScheduleFound', function(){
        if ($scope.parseType === 'yaml'){
            try{
                $scope.extraVars = '---\n' + jsyaml.safeDump($scope.serializedExtraVars);
            }
            catch(err){ return; }
        }
        else if ($scope.parseType === 'json'){
            try{
                $scope.extraVars = JSON.stringify($scope.serializedExtraVars, null, ' ');
            }
            catch(err){ return; }
        }
        ParseTypeChange({ 
            scope: $scope, 
            variable: 'extraVars', 
            parse_variable: 'parseType',
            field_id: 'SchedulerForm-extraVars' 
        });
    });
    
    $scope.$watch('extraVars', function(){
        if ($scope.parseType === 'yaml'){
            try{
                $scope.serializedExtraVars = jsyaml.safeLoad($scope.extraVars);
            }
            catch(err){ return; }
        }
        else if ($scope.parseType === 'json'){
            try{
                $scope.serializedExtraVars = JSON.parse($scope.extraVars);
            }
            catch(err){ return; }
        }
    });

    EditSchedule({
        scope: $scope,
        id: parseInt($stateParams.schedule_id),
        callback: 'SchedulesRefresh',
        base: $scope.base ? $scope.base: null
    });

    var callSelect2 = function() {
        CreateSelect2({
            element: '.MakeSelect2',
            multiple: false
        });
    };

    $scope.$on("updateSchedulerSelects", function() {
        callSelect2();
    });

    callSelect2();
}];