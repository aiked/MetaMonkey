function DependencyTrigger(elementId, dependency) {
    this.element = $(elementId);
    this.dependency = dependency;
    this.is = function (values) {
    this.values = values;
    this.addHandler();
    console.log(["showing", this.dependency.element.id, "when", this.element.id, "is", this.values].join(" "));
    }
;
    this.addHandler = function () {
    Event.observe(this.element, "change", this.checkDependency.bind(this));
    }
;
    this.checkDependency = function () {
    console.log(["checking", this.element.id, "for", this.values].join(" "));
    if (this.values.split(",").indexOf($F(this.element)) > -1) {
    this.dependency.element.show();
    } else {
    this.dependency.element.hide();
    }
    }
;
}

function Dependency(elementId) {
    this.element = $(elementId);
    this.when = function (elementId) {
    return (new DependencyTrigger(elementId, this));
    }
;
}

function show(elementId) {
    return (new Dependency(elementId));
}

(function () {
    var dependency = new Dependency("state-field");
    (function (parent) {
    var dependencyTrigger = new DependencyTrigger("country", parent);
    (function (parent) {
    parent.values = "United States";
    parent.addHandler();
    console.log(["showing", parent.dependency.element.id, "when", parent.element.id, "is", parent.values].join(" "));
    }
)(dependencyTrigger);
    }
)(dependency);
    return dependency;
}
)();
