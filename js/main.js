$(document).ready(function() {

  if($('#fullpage').length>0) {

    let slider = new fullpage('#fullpage', {
      licenseKey: 'YOUR KEY HERE',
      anchors: ['firstSection', 'secondSection','thirdSection', 'fourthSection', 'fifthSection' , 'sixSection'],
      scrollOverflow: true,
      slidesNavigation: true,
      controlArrows: false,
      navigation: true,
      autoScrolling: true,
      menu: '#menu',
      slidesNavPosition: 'bottom',
      onLeave: function(origin, destination, direction) {
        let index = destination;
        console.log(destination);
        let title = destination.item.attributes[1].nodeValue;
        $('.main-header__subtitle').text(title);
      },
    });

  }

  if ($('#fp-nav').length > 0 && $('.section').length <= 1) {
    $('#fp-nav').hide();
  }

var mySlider = function (selector, result) {
    if($(selector).length < 1) {
        return false;
    }
    var sliderProps = {
        fill: "#A39C96",
        background: "#DAD0C6"
    };
    var element = $(selector);
    var slider = element.find(".slider");
    var resInput = element.find(result);

    let count = slider.val();

    slider.on("input", function (event) {
        applyFill(event.target);
        count = +event.target.value;
    });

     resInput.on('keypress', function(e) {
        if(e.charCode < 48 || e.charCode > 57) {
            return false;
        }
    })

    resInput.on('keydown', function(e) {

        console.log('test')
        var self = $(this);
        clearTimeout(self.data('timer'));

        self.data('timer', setTimeout(function() {
            self.removeData('timer');

            var value = parseInt( self.val() );
            var min = parseInt( self.attr('min') );
            var max = parseInt( self.attr('max') );

            if(value < min) {
                count = min;
            } else if(value > max) {
                count = max;
            } else {
                count = value;
            }

            slider[0].value = count;
            slider.trigger('change');
            applyFill(slider[0]);
        }, 1000));
    });

    resInput.on('blur', function() {
        if($(this).val().trim() == '') {
            var def = $(this).data('val');
            $(this).val(def);
        }
    });

    applyFill(slider[0]);

    function applyFill(slider) {
        var percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
        var bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
        $(slider).css({
            background: bg
        });
        resInput.val(slider.value);
    }

};

mySlider('#slider', '.take__inner input');
mySlider('#slider2', '.take__inner input');

    function validate(input, length, regExp, error, phone) {

    $(input).on('blur keyup', function() {
      var value = $(this).val();
      var that = $(this);

      regExp = regExp == '' ? /./ : regExp;

      if (phone === true) {
        bool_reg = !regExp.test(value);
      } else {
        bool_reg = regExp.test(value);
      }

      if (value.length > length && value !== '' && bool_reg) {
        that.removeClass('form-fail').addClass('form-done');
        $(error).slideUp();
      } else {
        that.removeClass('form-done').addClass('form-fail');
        $(error).slideDown();
      }
    });

  }

  // деакцивация кнопки если есть поле с ошибкой

  function disBtn(input, btn, bool) {
    var input = $(input);
    input.on('blur keyup', function() {

      if (input.hasClass('form-fail') || bool == true) {
        $(btn).attr('disabled', 'disabled');
      } else {
        $(btn).removeAttr('disabled');
      }

    });

  }

  // для проверки при нажатии

  function valClick(input, length, regExp, error, phone) {
    var value = $(input).val();

    regExp = regExp == '' ? /./ : regExp;

    if (phone === true) {
      bool_reg = regExp.test(value);
    } else {
      bool_reg = !regExp.test(value);
    }

    if (value.length < length || value === '' || bool_reg) {
      $(input).addClass('form-fail');
      $(error).slideDown();
    }
  }

  //  деакцивация кнопки при нажатии

  function disBtnClick(input, btn) {
    var input = $(input);

    if (input.hasClass('form-fail')) {
      $(btn).attr('disabled', 'disabled');
      return false;
    } else {
      return true;
    }

  }

  $('input[type="tel"]').mask("+38 (999) 999-99-99");

  var regName = /^[a-zA-Zа-яА-ЯёЁIi]+/;
  var regEmail = /[-.\w]+@[-.\w]+\.[-.\w]+/i;
  var regPhone = /[_]/i;

  $('#w_btn').on('click', function() {
    sendForm();
  });

  function sendForm() {

   
    let phone = $('#w_tel').val();
     let name = $('#w_fio').val();
    let email = $('#w_email').val();
    let msg = $('#w_msg').val();

    validate('#w_tel', 1, regPhone, '.write__error--tel', true);
    validate('#w_fio', 1, regName, '.write__error--fio');
    validate('#w_email', 1, regEmail, '.write__error--email');
    
    disBtn('#w_tel, #w_fio, #w_email', '#w_btn');
    
    valClick('#w_tel', 1, regPhone, '.write__error--tel', true);
    valClick('#w_fio', 1, regName, '.write__error--fio');
    valClick('#w_email', 1, regEmail, '.write__error--email');
    var btn_bool = disBtnClick('#w_tel, #w_fio, #w_email', '#w_btn');

    if (btn_bool) {
      $.ajax({
        url: myajax.url,
        type: 'POST',
        data: {
          action: 'contact',
          name: name,
          phone: phone,
          email: email,
          msg: msg,
        },
      }).done(function(data) {
        $('#w_fio, #w_tel, #w_email, #w_msg').val('').removeClass('form-done');
        var text = 'Ваше повідомлення відправлене!';

        $('.msg-modal').html(text).addClass('msg-modal-active');
        setTimeout(function() {
          $('.msg-modal').removeClass('msg-modal-active');
        }, 2500);
      });

    }

    return false;
  }

  validate('#w_fio', 1, regName, '.write__error--name');
  validate('#w_email', 1, regEmail, '.write__error--email');
  validate('#w_tel', 1, regPhone, '.write__error--tel', true);
  disBtn('#w_fio, #w_tel, #w_email', '#w_btn');

  //sendTake !!!!!!!!!!!!!!

 $('#f_btn').on('click', function() {
    sendTake();
  });

  function sendTake() {
    let phone = $('#f_tel').val();
    let email = $('#f_email').val();
    let surname = $('#f_surname').val();
    let name = $('#f_name').val();
    let patronymic = $('#f_patronymic').val();
    let number = $('#number').val();
    let date = $('#date').val();
    let ipn = $('#ipn').val();
    let phone2 = $('#f_tel2').val();
    let fio = $('#f_fio').val();
    let work = $('#f_work').val();
    let money = $('#f_money').val();

    validate('#f_tel', 1, regPhone, '.take__error--tel', true); 
    validate('#f_email', 1, regEmail, 'take__error--email');
    validate('#f_surname', 1, regName, '.take__error--surname');
    validate('#f_name', 1, regName, '.take__error--name');
    validate('#f_patronymic', 1, regName, '.take__error--patronymic');
    validate('#f_number', 1, regName, '.take__error--number');
    validate('#f_date', 1, regName, '.take__error--date');
    validate('#f_ipn', 1, regName, '.take__error--ipn');
    validate('#f_tel2', 1, regPhone, '.take__error--tel2', true); 
     validate('#f_fio', 1, regPhone, '.take__error--fio'); 
     validate('#f_work', 1, regName, '.take__error--work'); 
    validate('#f_money', 1, regName, '.take__error--money'); 
    validate('#f_cost', 1, regName, '.take__error--cost'); 

    valClick('#f_tel', 1, regPhone, '.take__error--tel', true); 
    valClick('#f_email', 1, regEmail, '.take__error--email');
    valClick('#f_surname', 1, regName, '.take__error--surname');
    valClick('#f_name', 1, regName, '.take__error--name');
    valClick('#f_patronymic', 1, regName, '.take__error--patronymic');
    valClick('#f_number', 1, regName, '.take__error--number');
    valClick('#f_date', 1, regName, '.take__error--date');
    valClick('#f_ipn', 1, regName, '.take__error--ipn');
    valClick('#f_tel2', 1, regPhone, '.take__error--tel2');
    valClick('#f_fio', 1, regPhone, '.take__error--fio'); 
   valClick('#f_work', 1, regName, '.take__error--work'); 
   valClick('#f_money', 1, regName, '.take__error--money'); 
    valClick('#f_cost', 1, regName, '.take__error--cost'); 
    
    var btn_bool = disBtnClick('#f_tel, #f_email, #f_surname, #f_name, #f_patronymic, #f_number, #f_date, #f_ipn, #f_tel2, #f_work, #f_money ', '#f_btn');
    console.log(btn_bool)
    if (btn_bool) {
      $.ajax({
        url: myajax.url,
        type: 'POST',
        data: {
          action: 'contact',
          phone: phone,
          email: email,
          surname: surname,
          name: name,
          patronymic: patronymic,
          number: number,
          date: date,
          ipn: ipn,
          phone2: phone2,
          fio: fio,
          work: work,
          money: money,
          cost: cost
        },
      }).done(function(data) {
        $('#f_tel, #f_email, #f_surname, #f_name, #f_patronymic, #f_number, #f_date, #f_ipn, #f_tel2, #f_work, #f_money').val('').removeClass('form-done');
        var text = 'Ваше повідомлення відправлене!';

        $('.msg-modal').html(text).addClass('msg-modal-active');
        setTimeout(function() {
          $('.msg-modal').removeClass('msg-modal-active');
        }, 2500);
      });

    }

    return false;
  }

  validate('#f_tel', 1, regName, '.take__error--tel' , true);
  validate('#f_email', 1, regEmail, '.take__error--email');
  validate('#f_surname', 1, regName, '.take__error--surname');
  validate('#f_name', 1, regName, '.take__error--name');
  validate('#f_name', 1, regName, '.take__error--patronymic');
  validate('#f_number', 1, regName, '.take__error--number');
  validate('#f_ipn', 1, regName, '.take__error--ipn');
  validate('#f_tel2', 1, regPhone, '.take__error--tel2', true); 
  validate('#f_work', 1, regName, '.take__error--work'); 
  validate('#f_money', 1, regName, '.take__error--money'); 
  validate('#f_cost', 1, regName, '.take__error--cost'); 
  disBtn('#f_tel, #f_email, #f_surname, #f_name, #f_patronymic, #f_number, #f_date, #f_ipn, #f_tel2, #f_work, #f_money', '#f_btn');


});

$(document).on('click', '.main-header__prev', function() {
    fullpage_api.moveSectionUp();
    console.log('test')
  })

  $(document).on('click', '.main-header__next', function() {
    fullpage_api.moveSectionDown();
  })

$(document).on('click', '.contacts__btn', function() {
  fullpage_api.moveTo(6);
})

$(document).on('click', '.popup .btn--write', function() {
  $('.popup').removeClass('popup--active');
})

$(document).on('click', '#popup-open', function() {
  $('.popup').addClass('popup--active');
})

$(document).on('click', '#popup-close, .popup__box', function() {
  $('.popup').removeClass('popup--active');
})

$(document).on('click', '.btn--write', function() {
  fullpage_api.moveTo(6);
})

$(document).click(function(e) {

  if ($('#popup-menu').is(e.target) && $('#popup-menu').has(e.target).length === 0) {
    $('#popup-menu').removeClass('popup--active');
  };

})

  $(document).on('click', '.select__wrap--single .select__item', function(e) {
    var index = $(this).index();
    $(".single__tem").removeClass("single__item--active").eq($(this).index()).addClass("single__item--active");

    $(".single__box").hide().eq(index).fadeIn();
    let elemPlaceholder = $('.select__wrap--single .select__placeholder');
  })

  $(document).on('click', '.select__wrap', function(e) {
    /* $('.select__wrap').on('click', function(e) { */
    if ($(e.target).is('.select__disabled') || $(e.target).closest('.select__list').length) {
      return false;
    }

    let $select__wrap = $(this);

    if (!$select__wrap.hasClass('select__wrap--active')) {
      if ($select__wrap.hasClass('select__wrap--end-active')) {
        // предотвращение дребезга
        // меню ещё закрывается
        return
      }
      showSelectList($select__wrap)
    } else {
      hideSelectList($select__wrap)
    }

  });

  $(document).on('click', '.select__item', function(e) {
    /* $('.select__wrap').on('click', '.select__item', function(e) { */
    if ($(e.target).is('.select__item--disabled')) {
      return false;
    } else if ($(e.target).is(".select__item")) {
      let $select__wrap = $(this).parents('.select__wrap')
      let $select__item = $(this)

      $select__wrap.find('.select__item--active').removeClass('select__item--active')
      $select__item.addClass('select__item--active');
      setPlaceholder(this);

      hideSelectList($select__wrap)
      e.stopPropagation();
    }

  });

  $(document).on('input', '.select__input', function(e) {
    /* $('body').on('input', '.select__input', function(e) { */
    let isFound;
    $(e.target).parent().siblings('li').each((i, el) => {
      let is = $(el).html().toLowerCase().indexOf(e.target.value.toLowerCase()) != -1;
      $(el).css("display", is ? "block" : "none");
      if (is) isFound = true;
    });
    $('.select__item-search-not-found').css("display", isFound ? "none" : "block");
  })

  // $(document).on('click', function(e) {
  //   var $select__wrap = $(".select__wrap");
  //   if (!$select__wrap.is(e.target) && $select__wrap.has(e.target).length === 0) {
  //     hideSelectList($select__wrap)
  //   }
  // });

  function clickOutside(e) {
    var $select__wrap = $(".select__wrap");
    if (!$select__wrap.is(e.target) && $select__wrap.has(e.target).length === 0) {
      hideSelectList($select__wrap)
    }
  }

  function showSelectList($select__wrap) {
    $(document).on('click', clickOutside);
    let $select__list = $select__wrap.find(".select__list");

    if ($('.js-datepicker').val() !== '') {
      let {
        height,
        top,
        bottom
      } = $select__list.get(0).getBoundingClientRect();
      if ($(window).height() < bottom - 16 && top > height + 16 * 2) {
        $select__wrap.addClass('select__wrap--position-top');
      }

      $('.select__wrap').removeClass('select__wrap--active');
      $select__wrap.addClass('select__wrap--start-active');
      setTimeout(() => {
        $select__wrap.removeClass('select__wrap--start-active').addClass('select__wrap--active');
        let duration = getTransitionDuration($select__list);
        setTimeout(() => {
          $select__wrap.addClass('select__wrap--end-active')
        }, duration)
      }, 0)
    }
  }

  function hideSelectList($select__wrap) {
    $(document).off('click', clickOutside);
    $select__wrap.removeClass('select__wrap--active');
    let duration = getTransitionDuration($select__wrap.find(".select__list"));
    setTimeout(() => {
      $select__wrap.removeClass('select__wrap--position-top select__wrap--end-active')
    }, duration)
  }

  function setPlaceholder(self) {
    var value_pl = $(self).html();
    $(self).parents('.select__wrap').find('.select__placeholder').html(value_pl);
  }

  function checkActive(self) {
    var text = $(self).find('.select__item--active').text();
    /* if (text === undefined || text === '') {
         text = $(self).find('.select__item:not(.select__item--disabled):eq(0)').addClass('select__item--active').text();
     }*/
    $(self).find('.select__placeholder').html(text);
  }

  // Возвращает макс прододжительность анимации $self
  // Поддерживает только время в секундах (s)
  function getTransitionDuration($self) {
    return Math.max(...$self.css('transition-duration').split('s,').map(parseFloat), 0) * 1000 + 50;
  }

  // }
