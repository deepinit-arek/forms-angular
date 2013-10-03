basePath = '../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    "app/components/jquery/jquery.js",
    "app/components/jquery-ui/ui/jquery-ui.js",
    "app/components/angular/angular.js",
    "app/components/angular-sanitize/angular-sanitize.js",
    "app/components/angular-route/angular-route.js",
    "app/components/underscore/underscore.js",
    "app/components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
    "app/components/angular-ui-date/src/date.js",
    "app/components/angular-ui-select2/src/select2.js",
    "app/components/ngInfiniteScroll/ng-infinite-scroll.js",
    "app/components/ng-grid/build/ng-grid.js",
    "app/components/select2/select2.js",
    'app/components/angular-mocks/angular-mocks.js',
    'app/components/angular-elastic/elastic.js',
    'app/components/angular-dragdrop/src/angular-dragdrop.js',
    'app/js/forms-angular.js',
    'app/js/**/*.js',
    'app/demo/demo.js',
    'app/demo/bespoke-field.js',
    'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

junitReporter = {
    outputFile: 'test_out/unit.xml',
    suite: 'unit'
};
