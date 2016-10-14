$(function() {

    $("body").removeClass("noscript");

    $(".queue").on("click", ".btn", function(ev) {
        var target = $(ev.target);
        var container = target.closest(".queue").find(".queue-container");
        var ix = container.data('qindex') || 1;
        var qname = target.is('.q1') ? 'queue1' : 'queue2';

        if (target.is('.clear')) {
            $.ajaxq.clear(qname);
            container.find(".node:not('.beforesend')").slideUp("slow");
        }
        else if(target.is('.abort')) {
            $.ajaxq.abort(qname);
            container.find(".node:not('.beforesend')").slideUp("slow");
        }
        else {
            addRequest(qname, target.data("delay"), container, ix, target.is(".btn-danger"));
            container.data('qindex', ix + 1);
        }
    });

    $("#isQueueRunning").click(function() {
        $("#isQueueRunningLabel").text($.ajaxq.isRunning() ? "Yes" : "No");
    });

    setTimeout(function() {
        $(".q1:eq(0)").click().click();
        $(".q2:eq(1)").click();
    }, 1000);

});


function addRequest(name, delay, container, num, error) {

    var node = $("<div class='node' />").appendTo(container);

    node.html("<strong>#" + num + "</strong><b>&#x25CF</b>" + delay + " second delay<i />");

    /*
    var postXHR = $.postq (name, 'http://jsfiddle.net/echo/jsonp/', { delay: delay }, function() {
        $(node).addClass("complete");
    }, "jsonp");
    */

    /*
    var getXHR = $.getq (name, 'http://jsfiddle.net/echo/jsonp/', { delay: delay }, function() {
        $(node).addClass("complete");
    }, "jsonp");
    */

    var interval;


    var jqXHR = $.ajaxq (name, {
        url: 'https://jsfiddle.net/echo/jsonp/',
        type: 'post',
        dataType: error ? "" : "jsonp",
        data: {
            date: (new Date()).getTime(),
            delay: delay
        },
        beforeSend: function() {
            $(node).addClass("beforesend");
            var date = new Date().getTime();
            interval = setInterval(function() {
                var numSeconds = Math.round((((new Date().getTime()) - date) / 1000));
                $(node).find("i").text(numSeconds + " seconds");
            }, 1000);
        },
        error: function() {
            $(node).addClass("error");
        },
        complete: function() {
            clearInterval(interval);
            $(node).addClass("complete").find("b").html("&#x2713");
        },
        success: function(response) {
            //$(node).addClass("success");
        }
    });

    /*
    // You can still use the promise API for interfacing with the return value from $.ajaxq, like so:
    jqXHR.success(function() {
        console.log("success", this, num, delay)
    });
    jqXHR.complete(function() {
        console.log("complete", this, num, delay)
    });
    jqXHR.error(function() {
        console.log("error", this, num, delay)
    });
    */
}
