$(document).ready(function () {
  $("#title").focus();
  // $('#text').autosize();

  // Tabs
  var fadeTiming = 150;
  $(".js-tabs-btn").on("click", function () {
    var self = this;
    if ($(self).hasClass("active")) return;
    $(self)
      .toggleClass("active")
      .parent()
      .siblings()
      .find("a")
      .removeClass("active");
    $(".js-tab.active")
      .fadeOut(fadeTiming, function () {
        $($(self).attr("data-tab-id")).fadeIn(fadeTiming).addClass("active");
      })
      .removeClass("active");
  });

  // Inbox buttons
  $(".js-inbox-btn").on("click", function () {
    var self = this;
    if ($(self).hasClass("active")) return;
    $(self).toggleClass("active").siblings().removeClass("active");
    $(self).siblings("textarea").hide();
    $($(self).attr("data-input-id")).show();
  });

  // Terminal
  var commands = {
    "the door is open":
      "How is this possible? The time stamps on your terminal.. it must have worked..There are things at play here bigger than you can imagine. We will need your help. There is a hidden channel I have set up in the MKCG Discord.They wont be able to find us, right under their nose. Find the bot command channel and enter /!root1991. remember, if anyo > Support channel terminated ",
  };

  var sep = ">";
  var typeWriterSpeed = 30;

  var anim = false;
  function typed(finish_typing) {
    return function (term, message, delay, finish) {
      anim = true;
      var prompt = term.get_prompt();
      var c = 0;
      if (message.length > 0) {
        term.set_prompt("");
        var new_prompt = "";
        var interval = setInterval(function () {
          // handle html entities like &amp;
          var chr = $.terminal.substring(message, c, c + 1);
          new_prompt += chr;
          term.set_prompt(new_prompt);
          c++;
          if (c == length(message)) {
            clearInterval(interval);
            // execute in next interval
            setTimeout(function () {
              // swap command with prompt
              finish_typing(term, message, prompt);
              anim = false;
              finish && finish();
            }, delay);
          }
        }, delay);
      }
    };
  }

  function length(string) {
    return $("<span>" + $.terminal.strip(string) + "</span>").text().length;
  }

  var typed_message = typed(function (term, message, prompt) {
    term.set_command("");
    term.echo(message);
    term.set_prompt(prompt);
  });

  $("#terminal").terminal(
    function (command, term) {
      if (command !== "") {
        try {
          const apiUrl =
            "https://main--celadon-dieffenbachia-edf87e.netlify.app/.netlify/functions/server";

          // SEND API REQUEST
          const body = {
            prompt: command,
          };

          $.ajax({
            type: "POST",
            url: apiUrl,
            data: body,
            crossDomain: true,
            dataType: "json",
          })
            .done(function (data) {
              var response = "";
              if (data.choices.length) {
                response = data.choices[0].text.trim();
              }

              if (!response) {
                throw 500;
              }
              typed_message(
                term,
                "[[;;;class_name]" + sep + response + "]",
                typeWriterSpeed
              );
            })
            .fail((error) => {
              throw 500;
            });

          // this.echo(sep + commands[command]);
        } catch (e) {
          typed_message(
            term,
            "[[;;;class_name]" +
              sep +
              "Im sorry, This messaging system is no longer supported, Please migrate to the new system." +
              "]",
            typeWriterSpeed
          );
          // this.echo(sep + 'Im sorry, This messaging system is no longer supported, Please migrate to the new system.');
        }
      } else {
        this.echo(sep);
      }
    },
    {
      greetings: "",
      name: "js_terminal",
      height: 200,
      prompt: "",
    }
  );
});
