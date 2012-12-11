(function() {
  var add_condition, add_operator_arguments, recalculate_condition_attrs, remove_condition, remove_operator_arguments, swtch, update_conditions_visibility;

  swtch = {
    disabled: '1',
    selective: '2',
    global: '3'
  };

  update_conditions_visibility = function(event) {
    var $conditions;
    $conditions = $(this).parents('ul.switches li').find('section.conditions');
    console.log($conditions.length);
    switch ($(this).val()) {
      case swtch.disabled:
      case swtch.global:
        return $conditions.hide();
      case swtch.selective:
        return $conditions.show();
    }
  };

  remove_operator_arguments = function(event) {
    return $(event.target).siblings('input[type=text]').remove();
  };

  add_operator_arguments = function(event) {
    var $operator, name_prefix, new_arguments;
    $operator = $(event.target);
    name_prefix = $operator.attr('name').split('-').slice(0, 3).join('-');
    new_arguments = $operator.find('option:selected').data('arguments').split(',');
    return $.each(new_arguments, function(index, argument) {
      var input;
      input = $('<input>').attr({
        name: name_prefix + '-' + argument,
        type: 'text'
      });
      return $operator.parent('section.condition').append(input);
    });
  };

  add_condition = function(event) {
    var $conditions, clone, prototype;
    $conditions = $(this).parents('ul.switches').find('ul.conditions');
    prototype = $conditions.find('li').first();
    clone = prototype.clone(true, true);
    clone.appendTo($conditions);
    clone.find('input,select').removeAttr('selected').attr('value', '');
    $(this).trigger('gutter.switch.conditions.changed');
    return false;
  };

  remove_condition = function(event) {
    var $conditions;
    $conditions = $(this).parents('ul.conditions');
    $(this).parents('ul.conditions li').remove();
    $conditions.trigger('gutter.switch.conditions.changed');
    return false;
  };

  recalculate_condition_attrs = function(event) {
    var attr_setter, condition_rows;
    attr_setter = function(attr_name, number) {
      return function(index, element) {
        var name_parts;
        name_parts = $(element).attr(attr_name).split('-');
        name_parts[1] = number + 1;
        return $(element).attr(attr_name, name_parts.join('-'));
      };
    };
    return condition_rows = $(this).find('ul.conditions li').each(function(index, element) {
      $(element).find('input,select').map(attr_setter('name', index));
      $(element).find('input,select').map(attr_setter('id', index));
      return $(element).find('label').map(attr_setter('for', index));
    });
  };

  $(function() {
    $('ul.switches li').delegate('select[name=state]', 'change', update_conditions_visibility);
    $('ul.switches li').delegate('select[name$=operator]', 'change', remove_operator_arguments);
    $('ul.switches li').delegate('select[name$=operator]', 'change', add_operator_arguments);
    $('ul.switches li').delegate('button[data-action=add]', 'click', add_condition);
    $('ul.switches li').delegate('button[data-action=remove]', 'click', remove_condition);
    $('ul.switches li').live('gutter.switch.conditions.changed', recalculate_condition_attrs);
    return $('ul.switches li select[name=state]').trigger('change');
  });

}).call(this);
