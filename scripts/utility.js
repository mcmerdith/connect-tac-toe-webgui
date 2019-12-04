var getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

var clearElem = function(elem) {
    $(elem).empty();
};

var error = function(error) {
    var $error = $('#error');
    $error.removeClass('d-none');
    $error.html(error);
}

var clearError = function() {
    var $error = $('#error');
    $error.addClass('d-none');
    clearElem($error);
}

function WebRequestor(repeat, callDelay) {
    this.servers = ['http://gs1.ctogameservers.tk:3000', 'http://localhost:3000'];
    this.connection = {
        id: 0,
        url: this.servers[0],
        retry: {
            attempt: true,
            delay: 20000
        },
        error: false,
        repeat: repeat,
        callDelay: callDelay,
        timeout: 5000
    };

    var self = this;

    this.webRequest = function(page, func, failfunc) {
        if (self.connection.retry.attempt) {
            $.ajax({
                headers: { 'Accept': 'plaintext'},
                type: 'GET',
                url: self.connection.url + '/' + page,
                crossDomain: true,
                mixedContent: true,
                timeout: self.connection.timeout
            }).done((data) => {
                func(data);
                if (self.connection.repeat) self.recall(page, func, failfunc);
            }).fail(() => {
                if (self.connection.id >= self.servers.length - 1) {
                    self.connection.retry.attempt = false;
                    self.connection.error = true;
                    setTimeout(self.clearError, self.connection.retry.delay);

                    var extra = "";
                    if (self.connection.repeat) extra = "Retrying in " + self.connection.retry.delay + " ms";
                    failfunc("Failed to connect to all servers. " + extra);
                } else {
                    failfunc("Failed to connect to '" + self.connection.url + "/" + page + "'");
                    self.connection.id++;
                    self.connection.url = self.servers[self.connection.id];
                }
                self.recall(page, func, failfunc);
            });
        } else {
            if (self.connection.repeat)
                self.recall(page, func, failfunc);
        }
    }
    this.recall = function(page, func, failfunc) {
        setTimeout(() => {self.webRequest(page, func, failfunc)}, callDelay);
    }
    this.clearError = function() {
        self.connection.retry.attempt = true;
        self.connection.error = false;
        self.connection.url = self.servers[0];
        self.connection.id = 0;
    }
}


// function(data, status, request)