/*!
 * veritheme.js v1.3.0
 * https://veritheme.com
 * MIT License
 */

(function () {
var veritheme = window.veritheme = window.veritheme || {};
// VtAccordion — expand/collapse with single and multi mode
var VtAccordion = {
  init: function() {
    var uid = 0;
    document.querySelectorAll('[data-vt-accordion-item]').forEach(function(item) {
      uid++;
      var trigger = item.querySelector('[data-vt-accordion-trigger]');
      var content = item.querySelector('[data-vt-accordion-content]');
      if (trigger && content) {
        var tId = 'acc-trigger-' + uid;
        var cId = 'acc-content-' + uid;
        trigger.id = tId;
        content.id = cId;
        trigger.setAttribute('aria-controls', cId);
        if (!trigger.hasAttribute('role') && trigger.tagName !== 'BUTTON') {
          trigger.setAttribute('role', 'button');
          trigger.setAttribute('tabindex', '0');
        }
        content.setAttribute('aria-labelledby', tId);
        content.setAttribute('role', 'region');
        var isOpen = !content.classList.contains('vt-hidden') && !content.classList.contains('hidden');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });

    function openContent(content) {
      content.classList.remove('vt-hidden');
      content.classList.add('open');
      // Measure the final height with transitions suppressed: while
      // padding-bottom is mid-transition, computed styles report the start
      // value and the measured height comes out short — freezing a max-height
      // that permanently clips the bottom padding.
      var prevTransition = content.style.transition;
      var prevMaxHeight = content.style.maxHeight;
      content.style.transition = 'none';
      content.style.maxHeight = 'none';
      var target = content.scrollHeight; // includes the final padding-bottom
      // …and back to the collapsed start, padding included: `.open` set under
      // `transition: none` jumped the padding to its end value at once, so the
      // panel first popped open by 16px and only then slid — the twitch on
      // every open. Starting from padding 0 lets both grow together.
      content.classList.remove('open');
      content.style.maxHeight = prevMaxHeight || '0px';
      void content.offsetHeight; // commit the collapsed start value
      content.style.transition = prevTransition;
      content.classList.add('open');
      content.style.maxHeight = target + 'px';

      // Высота в пикселях — снимок одного момента. Стоит после раскрытия
      // подгрузиться веб-шрифту или смениться ширине колонки, как текст
      // переносится иначе, а потолок остаётся прежним и срезает низ вместе
      // с нижним отступом — именно так открытая панель упиралась в свой
      // разделитель, пока страницу не перезагрузишь. Поэтому, как только
      // раскрытие доиграло, потолок снимается совсем.
      var release = function() {
        content.removeEventListener('transitionend', onEnd);
        if (content.classList.contains('open')) content.style.maxHeight = 'none';
      };
      var onEnd = function(e) {
        if (e.target !== content || e.propertyName !== 'max-height') return;
        release();
      };
      content.addEventListener('transitionend', onEnd);
      // Страховка на случай, когда перехода нет вовсе (prefers-reduced-motion,
      // фоновая вкладка): transitionend тогда не придёт, а потолок обязан
      // сняться — иначе баг просто переезжает в эти случаи.
      setTimeout(release, 600);
    }

    function closeContent(content) {
      // Схлопывание от `none` не анимируется — сначала возвращаем потолку
      // текущую фактическую высоту, от неё и едем к нулю.
      if (!content.style.maxHeight || content.style.maxHeight === 'none') {
        content.style.maxHeight = content.scrollHeight + 'px';
        void content.offsetHeight;
      }
      content.style.maxHeight = '0px';
      content.classList.remove('open');
      content.addEventListener('transitionend', function handler() {
        if (content.style.maxHeight === '0px') {
          content.classList.add('vt-hidden');
        }
        content.removeEventListener('transitionend', handler);
      });
    }

    document.querySelectorAll('[data-vt-accordion-content]').forEach(function(content) {
      if (!content.classList.contains('vt-hidden') && !content.classList.contains('hidden')) {
        openContent(content);
      }
    });

    document.querySelectorAll('[data-vt-accordion-trigger]').forEach(function(trigger) {
      if (trigger.hasAttribute('data-vt-accordion-init')) return;
      trigger.setAttribute('data-vt-accordion-init', 'true');

      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
      });
      trigger.addEventListener('click', function() {
        var item = trigger.closest('[data-vt-accordion-item]');
        var accordion = trigger.closest('[data-vt-accordion]');
        var mode = accordion.getAttribute('data-vt-accordion');
        var content = item.querySelector('[data-vt-accordion-content]');
        var icon = trigger.querySelector('[data-vt-accordion-icon]');
        var isOpen = !content.classList.contains('vt-hidden') && !content.classList.contains('hidden') && content.classList.contains('open');

        if (mode === 'single') {
          accordion.querySelectorAll('[data-vt-accordion-item]').forEach(function(otherItem) {
            var otherContent = otherItem.querySelector('[data-vt-accordion-content]');
            var otherTrigger = otherItem.querySelector('[data-vt-accordion-trigger]');
            var otherIcon = otherItem.querySelector('[data-vt-accordion-trigger] [data-vt-accordion-icon]');
            if (otherItem !== item && !otherContent.classList.contains('vt-hidden') && !otherContent.classList.contains('hidden')) {
              closeContent(otherContent);
              if (otherIcon) otherIcon.classList.remove('vt-rotate-180');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          closeContent(content);
          if (icon) icon.classList.remove('vt-rotate-180');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          content.classList.remove('vt-hidden');
          void content.offsetHeight;
          openContent(content);
          if (icon) icon.classList.add('vt-rotate-180');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
};

// VtCalendar — month navigation, single/range selection and roving keyboard
// focus for `[data-vt-calendar]` cards. Selection is tracked by date, not by grid
// position, so it survives navigating between months.
var VtCalendar = {
  init: function() {
    document.querySelectorAll('[data-vt-calendar]').forEach(function(cal) {
      if (cal.dataset.vtCalendarBound) return;
      cal.dataset.vtCalendarBound = 'true';

      var grid = cal.querySelector('[data-vt-calendar-grid]') || cal;
      // A calendar lays its days out as week rows (.vt-calendar-week inside
      // .vt-calendar-days, or the older .vt-date-picker-week / -days); an
      // older flat grid takes the days as direct children.
      // data-vt-week-start="1" starts the week on Monday.
      var byWeek = grid.classList.contains('vt-calendar-days') || grid.classList.contains('vt-date-picker-days');
      var weekClass = grid.classList.contains('vt-calendar-days') ? 'vt-calendar-week' : 'vt-date-picker-week';
      var weekStart = Number(cal.dataset.vtWeekStart || 0);
      var heading = cal.querySelector('[data-vt-calendar-heading]');
      var monthKey = cal.dataset.vtCalendarMonth || new Date().toISOString().slice(0, 7);
      var parts = monthKey.split('-').map(Number);
      var view = new Date(parts[0], parts[1] - 1, 1);
      var start = null;
      var end = null;

      function stamp(date) {
        return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');
      }

      function monthOf(date) {
        return stamp(date).slice(0, 7);
      }

      function days() {
        return Array.from(grid.querySelectorAll('.vt-calendar-day'));
      }

      function readable(value) {
        return new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }

      // Give every day button a date, a label and its disabled/pressed state.
      function prepare() {
        days().forEach(function(day) {
          if (!day.dataset.vtDate) {
            day.dataset.vtDate = stamp(new Date(view.getFullYear(), view.getMonth(), Number(day.textContent)));
          }
          day.disabled = day.disabled || day.classList.contains('vt-muted') || day.classList.contains('vt-outside');
          day.setAttribute('aria-label', readable(day.dataset.vtDate));
          day.setAttribute('aria-pressed', String(day.classList.contains('vt-active')));
          day.tabIndex = day.classList.contains('vt-active') ? 0 : -1;
        });
        ensureTabbable();
      }

      // Exactly one enabled day stays in the tab order.
      function ensureTabbable(preferred) {
        var all = days();
        var target = preferred || all.find(function(day) { return day.tabIndex === 0 && !day.disabled; }) ||
          all.find(function(day) { return !day.disabled; });
        all.forEach(function(day) { day.tabIndex = day === target ? 0 : -1; });
      }

      function dayButton(date, outside) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = outside ? 'vt-calendar-day vt-outside' : 'vt-calendar-day';
        button.textContent = String(date.getDate());
        button.dataset.vtDate = stamp(date);
        return button;
      }

      function paint() {
        days().forEach(function(day) {
          var value = day.dataset.vtDate;
          var selected = value === start || value === end;
          day.classList.toggle('vt-active', selected);
          day.classList.toggle('vt-range-middle', !!(start && end && value > start && value < end));
          day.classList.toggle('vt-range-start', !!(start && end) && value === start);
          day.classList.toggle('vt-range-end', !!(start && end) && value === end);
          day.classList.remove('vt-bg-brand-fill/10');
          day.setAttribute('aria-pressed', String(selected));
        });
      }

      // The authored month may carry extras the script cannot regenerate
      // (event dots, badges), so it is restored from a snapshot instead of
      // being rebuilt when the user navigates back to it.
      prepare();
      var authoredMonth = monthOf(view);
      var authoredGrid = grid.innerHTML;

      var active = days().filter(function(day) {
        return day.classList.contains('vt-active') || day.classList.contains('vt-range-start') || day.classList.contains('vt-range-end');
      });
      if (active[0]) start = active[0].dataset.vtDate;
      if (active.length > 1) end = active[active.length - 1].dataset.vtDate;

      function render() {
        if (heading) {
          heading.textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        cal.dataset.vtCalendarMonth = monthOf(view);

        if (monthOf(view) === authoredMonth) {
          grid.innerHTML = authoredGrid;
        } else {
          grid.replaceChildren();
          var lead = (view.getDay() - weekStart + 7) % 7;
          var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
          if (byWeek) {
            // Whole weeks: the neighbouring months' days fill the first and
            // last rows, dimmed and disabled, as in the authored month.
            var cells = [];
            for (var back = lead; back > 0; back--) cells.push(dayButton(new Date(view.getFullYear(), view.getMonth(), 1 - back), true));
            for (var d = 1; d <= count; d++) cells.push(dayButton(new Date(view.getFullYear(), view.getMonth(), d), false));
            for (var after = 1; cells.length % 7; after++) cells.push(dayButton(new Date(view.getFullYear(), view.getMonth() + 1, after), true));
            for (var w = 0; w < cells.length; w += 7) {
              var week = document.createElement('div');
              week.className = weekClass;
              cells.slice(w, w + 7).forEach(function(cell) { week.append(cell); });
              grid.append(week);
            }
          } else {
            for (var pad = 0; pad < lead; pad++) grid.append(document.createElement('span'));
            for (var n = 1; n <= count; n++) grid.append(dayButton(new Date(view.getFullYear(), view.getMonth(), n), false));
          }
        }
        prepare();
        paint();
      }

      cal.addEventListener('click', function(e) {
        var nav = e.target.closest('[data-vt-calendar-nav]');
        if (nav) {
          view.setMonth(view.getMonth() + Number(nav.dataset.vtCalendarNav));
          render();
          return;
        }

        var day = e.target.closest('.vt-calendar-day');
        if (!day || day.disabled) return;
        var value = day.dataset.vtDate;

        if (cal.dataset.vtCalendar === 'range') {
          if (!start || end) {
            start = value;
            end = null;
          } else {
            end = value;
            if (end < start) {
              var swap = start;
              start = end;
              end = swap;
            }
          }
        } else {
          start = value;
          end = null;
        }

        paint();
        ensureTabbable(day);
        cal.dispatchEvent(new CustomEvent('vt:datechange', { bubbles: true, detail: { start: start, end: end } }));
      });

      grid.addEventListener('keydown', function(e) {
        var day = e.target.closest('.vt-calendar-day');
        if (!day) return;

        var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (delta === undefined && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault();

        var date = new Date(day.dataset.vtDate + 'T12:00:00');
        if (e.key === 'Home') {
          date.setDate(1);
        } else if (e.key === 'End') {
          date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        } else {
          date.setDate(date.getDate() + delta);
        }

        if (date.getMonth() !== view.getMonth() || date.getFullYear() !== view.getFullYear()) {
          view = new Date(date.getFullYear(), date.getMonth(), 1);
          render();
        }

        var next = days().find(function(candidate) {
          return candidate.dataset.vtDate === stamp(date) && !candidate.disabled;
        });
        if (next) {
          ensureTabbable(next);
          next.focus();
        }
      });
    });
  }
};

// VtChip — toggleable filter chips inside [data-vt-chip-group]
var VtChip = {
  init: function() {
    document.querySelectorAll('[data-vt-chip-group]').forEach(function(group) {
      if (group.hasAttribute('data-vt-chip-bound')) return;
      group.setAttribute('data-vt-chip-bound', 'true');
      group.querySelectorAll('.vt-chip-btn').forEach(function(btn) {
        var selected = btn.getAttribute('data-vt-selected') === 'true' || btn.classList.contains('vt-chip-active');
        btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
        btn.addEventListener('click', function() {
          var isSelected = btn.getAttribute('data-vt-selected') === 'true';
          btn.setAttribute('data-vt-selected', isSelected ? 'false' : 'true');
          btn.setAttribute('aria-pressed', isSelected ? 'false' : 'true');
          btn.classList.toggle('vt-chip-active', !isSelected);
        });
      });
    });
  }
};

// VtRadioGroup — custom radio circles grouped by [data-vt-group]
var VtRadioGroup = {
  init: function() {
    document.querySelectorAll('[data-vt-group] .vt-radio').forEach(function(radio) {
      var label = radio.closest('label');
      if (!label || label.hasAttribute('data-vt-radio-bound')) return;
      label.setAttribute('data-vt-radio-bound', 'true');
      var disabled = radio.classList.contains('disabled');
      label.setAttribute('role', 'radio');
      label.setAttribute('aria-checked', String(radio.classList.contains('selected')));
      if (disabled) label.setAttribute('aria-disabled', 'true');
      else label.setAttribute('tabindex', '0');
      label.addEventListener('click', function() {
        if (radio.classList.contains('disabled')) return;
        var group = radio.closest('[data-vt-group]');
        group.querySelectorAll('.vt-radio').forEach(function(r) {
          r.classList.remove('selected');
          var own = r.closest('label');
          if (own) own.setAttribute('aria-checked', 'false');
        });
        radio.classList.add('selected');
        label.setAttribute('aria-checked', 'true');
      });
      label.addEventListener('keydown', function(e) {
        var group = radio.closest('[data-vt-group]');
        var labels = Array.prototype.slice.call(group.querySelectorAll('label[role="radio"]:not([aria-disabled="true"])'));
        var at = labels.indexOf(label);
        var step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (step) {
          e.preventDefault();
          var next = labels[(at + step + labels.length) % labels.length];
          next.click();
          next.focus();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          label.click();
        }
      });
    });
    document.querySelectorAll('[data-vt-group]').forEach(function(group) {
      if (group.querySelector('.vt-radio') && !group.hasAttribute('role')) group.setAttribute('role', 'radiogroup');
    });
  }
};

// selectRadio — called via onclick in HTML (docs markup)
function selectRadio(group, el) {
  document.querySelectorAll('[data-vt-group="' + group + '"] .vt-radio').forEach(function(r) {
    r.classList.remove('selected');
  });
  var radio = el.querySelector('.vt-radio');
  if (radio && !radio.classList.contains('disabled')) radio.classList.add('selected');
}

// Inline `onclick` looks these up on window. In the shipped bundle the files
// are concatenated at top level, where a function declaration is already
// global; under a bundler it would be module-scoped, so pin them explicitly.
if (typeof window !== 'undefined') veritheme.selectRadio = selectRadio;

// VtTabs — tab switching for [data-vt-tab-group] with roving-tabindex keyboard nav
var VtTabs = {
  activate: function(container, tabName) {
    container.querySelectorAll('[role="tab"]').forEach(function(t) {
      if(t.closest('[data-vt-tab-group]')!==container)return;
      var isActive = t.getAttribute('data-vt-tab') === tabName;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      t.classList.toggle('vt-active', isActive);
    });
    container.querySelectorAll('[role="tabpanel"]').forEach(function(p) {
      if(p.closest('[data-vt-tab-group]')!==container)return;
      p.classList.toggle('vt-hidden', p.getAttribute('data-vt-panel') !== tabName);
    });
  },

  init: function() {
    document.querySelectorAll('[data-vt-tab-group]').forEach(function(container) {
      if(container.getAttribute('data-vt-tab-group')==='component-page')return;
      if (container.hasAttribute('data-vt-tabs-bound')) return;
      container.setAttribute('data-vt-tabs-bound', 'true');
      container.querySelectorAll('[role="tab"]').forEach(function(tab) {
        if(tab.closest('[data-vt-tab-group]')!==container)return;
        tab.addEventListener('click', function() {
          VtTabs.activate(container, tab.getAttribute('data-vt-tab'));
        });
      });
    });

    if (!window.__vtTabsKeyboard) {
      window.__vtTabsKeyboard = true;
      document.addEventListener('keydown', function(e) {
        var tab = e.target;
        if (!tab || tab.getAttribute('role') !== 'tab') return;
        if(tab.closest('[data-vt-tab-group]')?.getAttribute('data-vt-tab-group')==='component-page')return;
        var tablist = tab.closest('[role="tablist"]');
        if (!tablist) return;
        var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
        var idx = tabs.indexOf(tab);
        var newIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { newIdx = (idx + 1) % tabs.length; }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { newIdx = (idx - 1 + tabs.length) % tabs.length; }
        else if (e.key === 'Home') { newIdx = 0; }
        else if (e.key === 'End') { newIdx = tabs.length - 1; }
        if (newIdx >= 0) { e.preventDefault(); tabs[newIdx].focus(); tabs[newIdx].click(); }
      });
    }
  }
};

// VtCollapsible — expand/collapse content with optional animation
var VtCollapsible = {
  init: function() {
    // Initialize open collapsibles
    document.querySelectorAll('[data-vt-collapsible][data-vt-collapsible-open]').forEach(function(collapsible) {
      var content = collapsible.querySelector('[data-vt-collapsible-content]');
      var icon = collapsible.querySelector('[data-vt-collapsible-icon]');
      if (content) {
        content.classList.remove('vt-hidden');
        if (collapsible.hasAttribute('data-vt-collapsible-animated')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
      if (icon) {
        icon.classList.add('vt-rotate-180');
      }
    });

    // Bind triggers with guard
    document.querySelectorAll('[data-vt-collapsible-trigger]').forEach(function(trigger) {
      if (trigger.hasAttribute('data-vt-collapsible-bound')) return;
      trigger.setAttribute('data-vt-collapsible-bound', 'true');

      trigger.addEventListener('click', function() {
        var collapsible = trigger.closest('[data-vt-collapsible]');
        var content = collapsible.querySelector(':scope > [data-vt-collapsible-content]');
        if (!content) {
          content = collapsible.querySelector('[data-vt-collapsible-content]');
        }
        var icon = collapsible.querySelector(':scope > * [data-vt-collapsible-icon]') || collapsible.querySelector('[data-vt-collapsible-icon]');
        var isAnimated = collapsible.hasAttribute('data-vt-collapsible-animated');
        var labelCollapse = trigger.querySelector('[data-vt-collapsible-label-collapse]');
        var labelExpand = trigger.querySelector('[data-vt-collapsible-label-expand]');
        var isOpen;

        if (isAnimated) {
          isOpen = parseInt(content.style.maxHeight) > 0;
        } else {
          isOpen = !content.classList.contains('vt-hidden');
        }

        if (isOpen) {
          if (isAnimated) {
            content.style.maxHeight = '0';
          } else {
            content.classList.add('vt-hidden');
          }
          if (icon) icon.classList.remove('vt-rotate-180');
          if (labelCollapse) labelCollapse.classList.add('vt-hidden');
          if (labelExpand) labelExpand.classList.remove('vt-hidden');
          collapsible.removeAttribute('data-vt-collapsible-open');
        } else {
          if (isAnimated) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.classList.remove('vt-hidden');
          }
          if (icon) icon.classList.add('vt-rotate-180');
          if (labelCollapse) labelCollapse.classList.remove('vt-hidden');
          if (labelExpand) labelExpand.classList.add('vt-hidden');
          collapsible.setAttribute('data-vt-collapsible-open', '');
        }
      });
    });
  }
};

// VtCombobox — searchable single/multi-select with tags. Options are MenuItem
// rows (.vt-command-item) whose check mark shows from aria-selected; the older
// .vt-combobox-item rows with a swapped .vt-combobox-icon still work. Tags are
// small chips (.vt-chip.vt-chip-sm with a .vt-chip-remove button) and the
// button trigger is a Select trigger (.vt-select-trigger); the older
// .vt-combobox-tag and .vt-combobox-trigger/.vt-combobox-button-label markup
// still works, and a tag field that holds old tags gets old tags.
var VtCombobox = {
  ITEM: '.vt-command-item, .vt-combobox-item',
  TAG: '.vt-chip, .vt-combobox-tag',

  init: function() {
    var ITEM = VtCombobox.ITEM;
    var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-4 vt-h-4 vt-shrink-0 vt-text-brand-fill vt-combobox-icon"><path d="M20 6 9 17l-5-5"/></svg>';
    var emptySpacer = '<span class="vt-w-4 vt-h-4 vt-shrink-0 vt-combobox-icon"></span>';
    var xTagSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    // Close on click outside
    if (!window.__vtComboboxEvents) {
      window.__vtComboboxEvents = true; // per window: <body> is replaced on a client-side swap, the document listener is not
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.vt-combobox-wrapper')) {
          document.querySelectorAll('[data-vt-combobox-content]').forEach(function(el) {
            // Shown open on purpose (docs `open`, [inert] preview, data-vt-keep-open) is kept.
            if (!el.closest('[data-vt-keep-open], .open, [inert]')) el.classList.remove('vt-open');
          });
        }
      });

      document.addEventListener('keydown', function(e) {
        var target = e.target;
        var wrapper = target && target.closest && target.closest('.vt-combobox-wrapper');
        if (!wrapper) return;
        var list = wrapper.querySelector('[data-vt-combobox-content]');
        if (!list) return;
        var items = Array.prototype.slice.call(list.querySelectorAll(ITEM)).filter(function(i) {
          return !i.classList.contains('vt-hidden');
        });
        var current = target.closest(ITEM);
        var field = wrapper.querySelector('input, .vt-select-trigger, .vt-combobox-trigger');
        if (e.key === 'Escape') {
          if (!list.classList.contains('vt-open')) return;
          e.preventDefault();
          list.classList.remove('vt-open');
          VtCombobox.focusClosed(list, field);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          list.classList.add('vt-open');
          var at = current ? items.indexOf(current) : -1;
          var next = e.key === 'ArrowDown' ? Math.min(at + 1, items.length - 1) : Math.max(at - 1, 0);
          if (items[next]) {
            items[next].setAttribute('tabindex', '-1');
            items[next].focus();
          }
        } else if (current && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          current.click();
          VtCombobox.focusClosed(list, field);
        }
      });
    }

    // Expose functions globally for inline onclick use
    veritheme.openCombobox = function(id) {
      var el = document.getElementById(id);
      if (el && !el.hasAttribute('data-vt-combobox-closing')) el.classList.add('vt-open');
    };

    veritheme.toggleCombobox = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('vt-open');
    };

    veritheme.filterCombobox = function(input, id) {
      var dropdown = document.getElementById(id);
      var query = input.value.toLowerCase();
      var items = dropdown.querySelectorAll(ITEM);
      var groups = dropdown.querySelectorAll('[data-vt-combobox-group]');
      var emptyEl = dropdown.querySelector('.vt-combobox-empty');
      var totalVisible = 0;

      if (groups.length > 0) {
        groups.forEach(function(group) {
          var groupItems = group.querySelectorAll(ITEM);
          var groupVisible = 0;
          groupItems.forEach(function(item) {
            if (item.textContent.toLowerCase().includes(query)) {
              item.classList.remove('vt-hidden');
              groupVisible++;
              totalVisible++;
            } else {
              item.classList.add('vt-hidden');
            }
          });
          group.style.display = groupVisible > 0 ? '' : 'none';
        });
      } else {
        items.forEach(function(item) {
          if (item.textContent.toLowerCase().includes(query)) {
            item.classList.remove('vt-hidden');
            totalVisible++;
          } else {
            item.classList.add('vt-hidden');
          }
        });
      }

      if (emptyEl) {
        emptyEl.classList.toggle('vt-hidden', totalVisible > 0 || !query);
      }
    };

    // The chosen option: highlighted (.vt-selected) and announced
    // (aria-selected), which also shows its check mark. Legacy rows swap
    // their .vt-combobox-icon between a check and a spacer.
    function setItemIcon(item, checked) {
      item.classList.toggle('vt-selected', checked);
      item.setAttribute('aria-selected', String(checked));
      var icon = item.querySelector('.vt-combobox-icon');
      if (icon) icon.outerHTML = checked ? checkSvg : emptySpacer;
    }

    veritheme.selectComboboxItem = function(item) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.vt-combobox-wrapper');
      var keepIcons = wrapper.hasAttribute('data-vt-keep-icons');
      var input = wrapper.querySelector('input');
      var dropdown = item.closest('[data-vt-combobox-content]');

      input.value = text;

      dropdown.querySelectorAll(ITEM).forEach(function(i) {
        if (keepIcons) { i.classList.remove('vt-selected'); i.setAttribute('aria-selected', 'false'); }
        else setItemIcon(i, false);
      });
      if (keepIcons) { item.classList.add('vt-selected'); item.setAttribute('aria-selected', 'true'); }
      else setItemIcon(item, true);

      dropdown.classList.remove('vt-open');
    };

    veritheme.selectComboboxButton = function(item, dropdownId) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.vt-combobox-wrapper');
      var label = wrapper.querySelector('.vt-select-trigger > span');
      var dropdown = document.getElementById(dropdownId);

      label.textContent = text;
      // A value, not the placeholder: the Select trigger's span loses .placeholder.
      label.classList.remove('placeholder');

      dropdown.querySelectorAll(ITEM).forEach(function(i) {
        setItemIcon(i, false);
      });
      setItemIcon(item, true);

      dropdown.classList.remove('vt-open');
    };

    veritheme.toggleMultiComboboxItem = function(item) {
      var isSelected = !item.classList.contains('vt-selected');
      setItemIcon(item, isSelected);

      var wrapper = item.closest('.vt-combobox-wrapper');
      var tagContainer = wrapper.querySelector('.vt-combobox-tags');
      var text = item.textContent.trim();

      if (isSelected) {
        var tag = document.createElement('span');
        tag.className = 'vt-chip vt-chip-sm';
        tag.setAttribute('data-vt-tag-value', text);
        tag.appendChild(document.createTextNode(text));
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'vt-chip-remove';
        removeBtn.setAttribute('aria-label', 'Remove ' + text);
        removeBtn.innerHTML = xTagSvg;
        removeBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          veritheme.removeComboboxTag(removeBtn);
        });
        tag.appendChild(removeBtn);
        tagContainer.insertBefore(tag, tagContainer.querySelector('input'));
      } else {
        // The label is arbitrary text — a quote in it ('12" screen') makes the
        // selector unparsable, so the tag stayed while the tick came off.
        var existing = null;
        tagContainer.querySelectorAll('[data-vt-tag-value]').forEach(function(t) {
          if (t.getAttribute('data-vt-tag-value') === text) existing = t;
        });
        if (existing) existing.remove();
      }

      VtCombobox._updateMultiPlaceholder(wrapper);
    };

    veritheme.removeComboboxTag = function(btn) {
      var tag = btn.closest(VtCombobox.TAG);
      if (!tag) return;
      var value = tag.getAttribute('data-vt-tag-value');
      var wrapper = tag.closest('.vt-combobox-wrapper');
      tag.remove();

      var dropdown = wrapper.querySelector('[data-vt-combobox-content]');
      if (dropdown) {
        dropdown.querySelectorAll(ITEM).forEach(function(item) {
          if (item.textContent.trim() === value) setItemIcon(item, false);
        });
      }

      VtCombobox._updateMultiPlaceholder(wrapper);
    };
  },

  // Back to the field without its onfocus opening the list again.
  focusClosed: function(list, field) {
    if (!field) return;
    list.setAttribute('data-vt-combobox-closing', '');
    field.focus();
    list.removeAttribute('data-vt-combobox-closing');
  },

  _updateMultiPlaceholder: function(wrapper) {
    var input = wrapper.querySelector('input');
    var tags = wrapper.querySelectorAll('.vt-combobox-tags [data-vt-tag-value], .vt-combobox-tag');
    if (input) {
      input.placeholder = tags.length > 0 ? '' : 'Add framework...';
    }
  }
};

// VtResizable — drag-to-resize panels horizontally or vertically
var VtResizable = {
  init: function() {
    document.querySelectorAll('[data-vt-resizable]').forEach(function(container) {
      if (container.hasAttribute('data-vt-resizable-init')) return;
      container.setAttribute('data-vt-resizable-init', 'true');

      var direction = container.dataset.vtResizable;
      var isHorizontal = direction === 'horizontal';
      var minPct = parseFloat(container.dataset.vtMin || '10');
      var maxPct = parseFloat(container.dataset.vtMax || '90');
      var handles = container.querySelectorAll(':scope > .vt-resize-handle');

      handles.forEach(function(handle) {
        var isDown = false;
        var startPos = 0;
        var prevPanel = null;
        var nextPanel = null;
        var containerSize = 0;
        var prevStart = 0;
        var nextStart = 0;

        handle.addEventListener('mousedown', function(e) {
          e.preventDefault();
          isDown = true;
          prevPanel = handle.previousElementSibling;
          nextPanel = handle.nextElementSibling;
          if (!prevPanel || !nextPanel) return;

          containerSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
          prevStart = isHorizontal ? prevPanel.offsetWidth : prevPanel.offsetHeight;
          nextStart = isHorizontal ? nextPanel.offsetWidth : nextPanel.offsetHeight;
          startPos = isHorizontal ? e.clientX : e.clientY;

          document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
          document.body.style.userSelect = 'none';
          handle.style.background = 'hsl(var(--vt-brand-fill) / 0.5)';
        });

        document.addEventListener('mousemove', function(e) {
          if (!isDown || !prevPanel || !nextPanel) return;
          var delta = (isHorizontal ? e.clientX : e.clientY) - startPos;
          var newPrev = prevStart + delta;
          var newNext = nextStart - delta;

          var minSize = containerSize * (minPct / 100);
          var maxSize = containerSize * (maxPct / 100);

          if (newPrev < minSize) { newPrev = minSize; newNext = prevStart + nextStart - minSize; }
          if (newNext < minSize) { newNext = minSize; newPrev = prevStart + nextStart - minSize; }
          if (newPrev > maxSize) { newPrev = maxSize; newNext = prevStart + nextStart - maxSize; }
          if (newNext > maxSize) { newNext = maxSize; newPrev = prevStart + nextStart - maxSize; }

          var prevPct = (newPrev / containerSize * 100).toFixed(1);
          var nextPct = (newNext / containerSize * 100).toFixed(1);

          if (isHorizontal) {
            prevPanel.style.width = prevPct + '%';
            nextPanel.style.width = nextPct + '%';
          } else {
            prevPanel.style.height = prevPct + '%';
            nextPanel.style.height = nextPct + '%';
          }

          prevPanel.style.flex = 'none';
          nextPanel.style.flex = 'none';

          var prevLabel = prevPanel.querySelector('.vt-size-label');
          var nextLabel = nextPanel.querySelector('.vt-size-label');
          if (prevLabel) prevLabel.textContent = Math.round(parseFloat(prevPct)) + '%';
          if (nextLabel) nextLabel.textContent = Math.round(parseFloat(nextPct)) + '%';
        });

        document.addEventListener('mouseup', function() {
          if (!isDown) return;
          isDown = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          handle.style.background = '';
        });
      });
    });
  }
};

// VtCarousel — slide carousel with dots, prev/next navigation
var VtCarousel = {
  init: function() {
    document.querySelectorAll('[data-vt-carousel]').forEach(function(el) {
      if (el.hasAttribute('data-vt-carousel-init')) return;
      el.setAttribute('data-vt-carousel-init', 'true');

      var carousel = el;
      var track = carousel.querySelector('[data-vt-carousel-track]');
      var prevBtn = carousel.querySelector('[data-vt-carousel-prev]');
      var nextBtn = carousel.querySelector('[data-vt-carousel-next]');
      var dotsContainer = carousel.querySelector('[data-vt-carousel-dots]');
      var total = parseInt(carousel.dataset.vtTotal || '0');
      var visible = parseInt(carousel.dataset.vtVisible || '1');
      var maxIndex = total - visible;
      var current = 0;

      function update() {
        // One step is a slide plus the gap after it: (track + gap) / visible.
        // In percent of the track, so it stays right when the page resizes.
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        track.style.transform = current === 0 ? '' :
          'translateX(calc(' + (-current) + ' * (100% + ' + gap + 'px) / ' + visible + '))';

        if (dotsContainer) {
          dotsContainer.querySelectorAll('[data-vt-dot]').forEach(function(dot) {
            var on = parseInt(dot.dataset.vtDot || '0') === current;
            if (dot.classList.contains('vt-carousel-dot')) {
              dot.classList.toggle('vt-active', on);
              dot.setAttribute('aria-current', on ? 'true' : 'false');
            } else {
              dot.className = 'vt-w-2 vt-h-2 vt-rounded-full vt-transition-colors ' + (on ? 'vt-bg-brand-fill' : 'vt-bg-surface-moderate');
            }
          });
        }

        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= maxIndex;
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          if (current > 0) { current--; update(); }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          if (current < maxIndex) { current++; update(); }
        });
      }

      if (dotsContainer) {
        dotsContainer.querySelectorAll('[data-vt-dot]').forEach(function(dot) {
          dot.addEventListener('click', function() {
            current = Math.min(parseInt(dot.dataset.vtDot || '0'), maxIndex);
            update();
          });
        });
      }

      update();
    });
  }
};

// VtDropdown — shared open/close state and the WAI-ARIA menu keyboard
// contract for `[data-vt-dropdown-trigger]` buttons and their `.vt-dropdown-menu`.
//
// One menu may have many triggers (a "More" button on every row of a list): the
// menu's own handlers are bound once, and the menu opens at the trigger that was
// used. A menu that is not next to its trigger in the markup is placed by the
// trigger's position; any menu opens upward when there is no room below.
//
// Attributes:
//   data-vt-dropdown-trigger="<menu id>"   on the trigger
//   data-vt-dropdown-bubble                on the trigger: let its click reach
//       handlers on its ancestors. By default the click stops at the trigger, so
//       a trigger inside a clickable row does not also activate the row.
//   data-vt-dropdown-close-on-select       on the menu: a checkbox or radio item
//       closes the menu too. By default only plain items close it, so several
//       options can be changed in one visit.
var VtDropdown = {
  items: function(menu) {
    return Array.from(menu.querySelectorAll('.vt-command-item,.vt-dropdown-item')).filter(function(item) {
      return item.getAttribute('aria-disabled') !== 'true' && !item.disabled;
    });
  },

  triggersFor: function(menu) {
    return Array.from(document.querySelectorAll('[data-vt-dropdown-trigger]')).filter(function(trigger) {
      return trigger.getAttribute('data-vt-dropdown-trigger') === menu.id;
    });
  },

  close: function(menu, restoreFocus) {
    // Drawn open in a prototype's state: the state decides (states.js takes
    // Escape and a click elsewhere to the state its button goes to).
    if (menu.hasAttribute('data-vt-keep-open')) return;
    menu.classList.remove('vt-open');
    VtDropdown.unplace(menu);
    var opener = menu.__vtDropdownOpener;
    menu.__vtDropdownOpener = null;
    var triggers = VtDropdown.triggersFor(menu);
    triggers.forEach(function(trigger) { trigger.setAttribute('aria-expanded', 'false'); });
    // Focus goes back to the trigger that opened the menu, not to the last one bound.
    var target = opener && document.contains(opener) ? opener : triggers[0];
    if (restoreFocus && target) target.focus();
  },

  // Inline styles this module set, so closing puts the stylesheet back in charge.
  PLACED: ['position', 'top', 'right', 'bottom', 'left', 'margin'],

  unplace: function(menu) {
    menu.__vtDropdownFixed = false;
    if (!menu.__vtDropdownPlaced) return;
    VtDropdown.PLACED.forEach(function(property) { menu.style.removeProperty(property); });
    menu.__vtDropdownPlaced = false;
  },

  // A container above the menu that cuts off what overflows it (a scrolling
  // sidebar, a card with overflow: hidden): a menu placed in the flow there is
  // clipped, so it is fixed to its trigger instead.
  clipper: function(menu) {
    for (var node = menu.parentElement && menu.parentElement.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      var style = getComputedStyle(node);
      if (style.overflowX !== 'visible' || style.overflowY !== 'visible') return node;
    }
    return null;
  },

  // Fixed is relative to the window unless an ancestor is transformed or
  // filtered (an animated drawer): then to that ancestor's box.
  fixedOrigin: function(menu) {
    for (var node = menu.parentElement; node && node !== document.documentElement; node = node.parentElement) {
      var style = getComputedStyle(node);
      var contain = style.contain || '';
      if (style.transform !== 'none' || style.filter !== 'none' || style.perspective !== 'none'
        || (style.backdropFilter && style.backdropFilter !== 'none')
        || /paint|layout|strict|content/.test(contain) || /transform|filter/.test(style.willChange || '')) {
        var box = node.getBoundingClientRect();
        return { left: box.left + node.clientLeft - node.scrollLeft, top: box.top + node.clientTop - node.scrollTop };
      }
    }
    return { left: 0, top: 0 };
  },

  // Where the open menu goes. Next to its trigger in the markup, the stylesheet
  // places it below, and it only flips upward when it would leave the viewport.
  // Anywhere else (one menu shared by many triggers), or next to its trigger
  // inside a container that clips (a chat's menu in a scrolling sidebar), it is
  // fixed to the trigger.
  place: function(menu, trigger) {
    VtDropdown.unplace(menu);
    var gap = 4;
    var anchor = trigger.getBoundingClientRect();
    // Layout size, not the painted box: the menu may be mid-way through its opening animation.
    var size = { width: menu.offsetWidth, height: menu.offsetHeight };
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var fitsBelow = anchor.bottom + gap + size.height <= viewportHeight;
    var fitsAbove = anchor.top - gap - size.height >= 0;
    // vt-dropdown-menu-up asks for the side above (an input at the bottom of the
    // screen); either side gives way to the other when the menu does not fit.
    var prefersUp = menu.classList.contains('vt-dropdown-menu-up');
    var end = menu.classList.contains('vt-dropdown-menu-end');
    var next = trigger.parentElement && trigger.parentElement.contains(menu);
    var clipped = next && VtDropdown.clipper(menu);
    if (clipped) {
      // Fixed in a clipping container: the side and the edge the stylesheet gave
      // the menu are kept — a page's own CSS that aligns a card's menu to the
      // right or opens it upward (Studio's card menus) still holds.
      var natural = menu.getBoundingClientRect();
      var wrap = menu.parentElement.getBoundingClientRect();
      if (!end && Math.abs(natural.right - wrap.right) < 2 && Math.abs(natural.left - wrap.left) >= 2) end = true;
      if (!prefersUp && natural.bottom <= anchor.top + 1) prefersUp = true;
    }
    var up = prefersUp ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;
    var beside = next && !clipped;
    if (beside) {
      if (up === prefersUp) return;
      if (up) {
        menu.style.top = 'auto';
        menu.style.bottom = '100%';
      } else {
        // An "up" menu with no room above opens below, as the stylesheet's default does.
        menu.style.top = '100%';
        menu.style.bottom = 'auto';
        menu.style.margin = 'var(--vt-spacing-2) 0 0';
      }
    } else {
      // vt-dropdown-menu-end: the menu's right edge on the trigger's right edge.
      var wanted = end ? anchor.right - size.width : anchor.left;
      var left = Math.max(gap, Math.min(wanted, viewportWidth - size.width - gap));
      var origin = VtDropdown.fixedOrigin(menu);
      menu.style.position = 'fixed';
      menu.style.margin = '0';
      menu.style.right = 'auto';
      menu.style.bottom = 'auto';
      menu.style.left = (left - origin.left) + 'px';
      menu.style.top = ((up ? anchor.top - gap - size.height : anchor.bottom + gap) - origin.top) + 'px';
      menu.__vtDropdownFixed = true;
    }
    menu.__vtDropdownPlaced = true;
  },

  closeAll: function(restoreFocus, except) {
    document.querySelectorAll('.vt-dropdown-menu.vt-open').forEach(function(menu) {
      // Combobox panels manage their own open state.
      // Shown open on purpose (a docs example's `open`, a preview in [inert],
      // `data-vt-keep-open`) is kept open.
      if (menu !== except && !menu.closest('.vt-combobox-wrapper') && !menu.closest('[data-vt-keep-open], .open, [inert]')) VtDropdown.close(menu, restoreFocus);
    });
  },

  open: function(trigger, focusLast) {
    var menu = document.getElementById(trigger.getAttribute('data-vt-dropdown-trigger'));
    if (!menu) return;
    VtDropdown.closeAll(false, menu);
    // Reopened from another trigger: the first one is no longer the open one.
    VtDropdown.triggersFor(menu).forEach(function(other) { other.setAttribute('aria-expanded', 'false'); });
    menu.classList.add('vt-open');
    menu.__vtDropdownOpener = trigger;
    VtDropdown.place(menu, trigger);
    trigger.setAttribute('aria-expanded', 'true');
    var items = VtDropdown.items(menu);
    var first = focusLast ? items[items.length - 1] : items[0];
    if (first) first.focus();
  },

  bindTrigger: function(trigger) {
    if (trigger.dataset.vtDropdownBound) return;
    trigger.dataset.vtDropdownBound = 'true';

    var menu = document.getElementById(trigger.getAttribute('data-vt-dropdown-trigger'));
    if (!menu) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-controls', menu.id);
    trigger.setAttribute('aria-expanded', 'false');
    VtDropdown.prepareItems(menu);

    trigger.addEventListener('click', function(e) {
      // A trigger often sits inside something clickable (a row, a card): by
      // default its click stops here. `data-vt-dropdown-bubble` lets it through.
      if (!trigger.hasAttribute('data-vt-dropdown-bubble')) e.stopPropagation();
      if (menu.classList.contains('vt-open') && menu.__vtDropdownOpener === trigger) VtDropdown.close(menu, true);
      else VtDropdown.open(trigger);
    });

    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        VtDropdown.open(trigger, e.key === 'ArrowUp');
      }
    });

    VtDropdown.bindMenu(menu);
  },

  // The menu's role and its rows' roles (menuitem, menuitemcheckbox, menuitemradio)
  // and checked states, from what each row holds. For a menu with a trigger and
  // for one drawn open in the markup (a prototype's state with its menu open).
  prepareItems: function(menu) {
    if (!menu.hasAttribute('role')) menu.setAttribute('role', 'menu');
    menu.querySelectorAll('.vt-command-item,.vt-dropdown-item').forEach(function(item) {
      item.tabIndex = -1;
      var checkbox = item.querySelector(CHECKBOX_INDICATOR);
      var radio = item.querySelector(RADIO_INDICATOR);
      var mark = item.querySelector('.vt-command-item-check');
      // A check row picks one of a group when the markup says so (role="menuitemradio",
      // the mode picker: title, description, check at the end); otherwise it toggles.
      var pickOne = mark && item.getAttribute('role') === 'menuitemradio';
      item.setAttribute('role', pickOne || (radio && !checkbox && !mark) ? 'menuitemradio' : checkbox || mark ? 'menuitemcheckbox' : 'menuitem');
      if (checkbox) item.setAttribute('aria-checked', String(indicatorOn(checkbox)));
      if (radio) item.setAttribute('aria-checked', String(indicatorOn(radio)));
      // A check mark row says its state itself (aria-checked in the markup).
      if (mark && !item.hasAttribute('aria-checked')) item.setAttribute('aria-checked', 'false');
    });
  },

  // A menu drawn open next to its button (a prototype's state with the menu
  // open: .vt-open in the markup, data-vt-keep-open): placed at its button as
  // if a click had opened it — fixed when a container would clip it. The button
  // is the wrap's first child that is not the menu. Hidden ones wait.
  placeOpen: function(scope) {
    (scope || document).querySelectorAll('.vt-dropdown-wrap > .vt-dropdown-menu.vt-open').forEach(function(menu) {
      if (menu.closest('.vt-combobox-wrapper') || !menu.getClientRects().length) return;
      var wrap = menu.parentElement;
      var trigger = null;
      for (var i = 0; i < wrap.children.length && !trigger; i++) if (wrap.children[i] !== menu) trigger = wrap.children[i];
      if (!trigger) return;
      menu.__vtDropdownOpener = trigger;
      VtDropdown.place(menu, trigger);
    });
  },

  // The menu's own handlers, once per menu however many triggers it has: bound
  // per trigger, one arrow key moved the focus once for every trigger.
  bindMenu: function(menu) {
    if (menu.__vtDropdownBound) return;
    menu.__vtDropdownBound = true;

    menu.addEventListener('keydown', function(e) {
      var items = VtDropdown.items(menu);
      var index = items.indexOf(document.activeElement);
      var next;

      if (e.key === 'Escape') {
        e.preventDefault();
        VtDropdown.close(menu, true);
        return;
      }
      if (e.key === 'Tab') {
        VtDropdown.close(menu, false);
        return;
      }
      if (e.key === 'ArrowDown') next = (index + 1) % items.length;
      if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = items.length - 1;
      if (items[next]) {
        e.preventDefault();
        items[next].focus();
      }

      var activates = e.key === 'Enter' || e.key === ' ';
      if (activates && index >= 0 && !['BUTTON', 'A'].includes(items[index].tagName)) {
        e.preventDefault();
        items[index].click();
      }
    });

    // Plain items close the menu on activation. Checkbox and radio items stay
    // open unless the menu says `data-vt-dropdown-close-on-select`.
    menu.addEventListener('click', function(e) {
      // A checkbox, switch or radio row turns by itself: no onclick in the
      // markup needed (one that has veritheme.toggleCheckbox already turned it).
      var row = e.target.closest('[role="menuitemcheckbox"],[role="menuitemradio"]');
      if (row && menu.contains(row) && !e.__vtToggled && row.getAttribute('aria-disabled') !== 'true') {
        if (row.getAttribute('role') === 'menuitemradio') selectMenuRadio(row); else toggleCheckbox(row);
      }
      var selector = menu.hasAttribute('data-vt-dropdown-close-on-select')
        ? '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'
        : '[role="menuitem"]';
      var item = e.target.closest(selector);
      if (item && item.getAttribute('aria-disabled') !== 'true') VtDropdown.close(menu, true);
    });
  },

  init: function() {
    document.querySelectorAll('[data-vt-dropdown-trigger]').forEach(VtDropdown.bindTrigger);
    // A menu with no trigger of its own (drawn open in a prototype's state, its
    // button going to another state): its rows still get their roles, the
    // arrows, Home and End, and its switches and checks turn.
    document.querySelectorAll('.vt-dropdown-menu').forEach(function(menu) {
      if (menu.__vtDropdownBound || menu.closest('.vt-combobox-wrapper') || !menu.querySelector('.vt-command-item,.vt-dropdown-item')) return;
      VtDropdown.prepareItems(menu);
      VtDropdown.bindMenu(menu);
    });
    VtDropdown.placeOpen();

    if (window.__vtDropdownEvents) return;
    window.__vtDropdownEvents = true;

    // A prototype's state shows a menu drawn open: it is placed at its button,
    // and when the state came from the user, the focus goes to its first row.
    document.addEventListener('vt-state-change', function(e) {
      var scope = e.target;
      requestAnimationFrame(function() {
        VtDropdown.placeOpen(scope);
        if (!e.detail || !e.detail.previous) return;
        var shown = Array.prototype.filter.call(scope.querySelectorAll('.vt-dropdown-menu.vt-open[data-vt-keep-open]'), function(m) { return m.getClientRects().length; })[0];
        var first = shown && VtDropdown.items(shown)[0];
        if (first && !shown.contains(document.activeElement)) first.focus();
      });
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('[data-vt-dropdown-trigger],.vt-dropdown-menu')) VtDropdown.closeAll(false);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') VtDropdown.closeAll(true);
    });
    // A fixed menu stays with its trigger when what holds the trigger scrolls
    // (the sidebar under a chat's menu) or the window resizes.
    var follow = function(e) {
      document.querySelectorAll('.vt-dropdown-menu.vt-open').forEach(function(menu) {
        var opener = menu.__vtDropdownOpener;
        if (!menu.__vtDropdownFixed || !opener) return;
        if (e && e.type === 'scroll' && e.target !== document && !(e.target.contains && e.target.contains(opener))) return;
        if (e && e.type === 'scroll' && menu.contains(e.target)) return;
        VtDropdown.place(menu, opener);
      });
    };
    document.addEventListener('scroll', follow, true);
    window.addEventListener('resize', follow);
  }
};

var CHECK_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// Checkable rows carry the system's own atoms: .vt-checkbox (.checked) and
// .vt-radio (.selected, with a .vt-dot). The older markup drew them with
// utilities (.checkbox-indicator / .radio-indicator) and still works.
// A switch at the end of a row (.vt-switch, a decorative span) is a checkbox
// indicator too: the row is the control, the switch shows its state (.vt-active).
var CHECKBOX_INDICATOR = '.vt-checkbox, .vt-switch, .checkbox-indicator';
var RADIO_INDICATOR = '.vt-radio, .radio-indicator';

function indicatorOn(indicator) {
  if (indicator.classList.contains('vt-checkbox')) return indicator.classList.contains('checked');
  if (indicator.classList.contains('vt-switch')) return indicator.classList.contains('vt-active');
  if (indicator.classList.contains('vt-radio')) return indicator.classList.contains('selected');
  if (indicator.classList.contains('checkbox-indicator')) return indicator.classList.contains('vt-bg-brand-fill');
  return !!indicator.children.length;
}

// Checkbox menu item: the visual indicator and aria-checked always agree.
function toggleCheckbox(item) {
  if (item.getAttribute('aria-disabled') === 'true') return;
  // Said on the click that ran it (an onclick in the markup): the menu's own
  // click handler then leaves the row alone instead of turning it back.
  if (typeof window !== 'undefined' && window.event) window.event.__vtToggled = true;
  var indicator = item.querySelector(CHECKBOX_INDICATOR);
  var mark = item.querySelector('.vt-command-item-check');
  if (!indicator && !mark) return;

  var wasChecked = item.getAttribute('aria-checked') === 'true';
  if (indicator && indicator.classList.contains('vt-checkbox')) {
    indicator.classList.toggle('checked', !wasChecked);
    if (!indicator.querySelector('.check-icon')) indicator.insertAdjacentHTML('beforeend', CHECK_ICON.replace('<svg ', '<svg class="check-icon" '));
  } else if (indicator && indicator.classList.contains('vt-switch')) {
    indicator.classList.toggle('vt-active', !wasChecked);
  } else if (indicator) {
    indicator.classList.remove('vt-bg-info-fill');
    ['vt-bg-brand-fill', 'vt-text-generic-white', 'vt-border-transparent'].forEach(function(cls) {
      indicator.classList.toggle(cls, !wasChecked);
    });
    indicator.innerHTML = wasChecked ? '' : CHECK_ICON;
  }
  // A check mark (.vt-command-item-check) shows from aria-checked alone.
  item.setAttribute('aria-checked', String(!wasChecked));
}

// Radio menu item: one selected indicator per menu.
function selectMenuRadio(item) {
  if (item.getAttribute('aria-disabled') === 'true') return;
  item.closest('.vt-dropdown-menu').querySelectorAll(RADIO_INDICATOR).forEach(function(indicator) {
    var row = indicator.closest('.vt-command-item,.vt-dropdown-item') || indicator.parentElement;
    var selected = row === item;
    if (indicator.classList.contains('vt-radio')) {
      indicator.classList.toggle('selected', selected);
      if (!indicator.querySelector('.vt-dot')) indicator.insertAdjacentHTML('beforeend', '<span class="vt-dot"></span>');
    } else {
      indicator.classList.remove('vt-border-info-fill', 'vt-border-input');
      indicator.classList.toggle('vt-border-brand-fill', selected);
      indicator.classList.toggle('vt-border-border-strong', !selected);
      indicator.innerHTML = selected ? '<span class="vt-w-2 vt-h-2 vt-rounded-full vt-bg-brand-fill"></span>' : '';
    }
    row.setAttribute('aria-checked', String(selected));
  });
  // Check-mark rows of a pick-one group (role="menuitemradio" with .vt-command-item-check):
  // the check shows from aria-checked alone.
  item.closest('.vt-dropdown-menu').querySelectorAll('[role="menuitemradio"]').forEach(function(row) {
    if (!row.querySelector('.vt-command-item-check') || row.querySelector(RADIO_INDICATOR)) return;
    row.setAttribute('aria-checked', String(row === item));
  });
}

if (typeof window !== 'undefined') {
  veritheme.toggleCheckbox = toggleCheckbox;
  veritheme.selectMenuRadio = selectMenuRadio;
}

veritheme.bindDropdownTrigger = function(trigger) { VtDropdown.bindTrigger(trigger); };

// VtScrollView — drag-to-scroll and scroll indicators
var VtScrollView = {
  init: function() {
    // Drag-to-scroll for horizontal containers
    document.querySelectorAll('.vt-drag-scroll').forEach(function(el) {
      if (el.hasAttribute('data-vt-drag-init')) return;
      el.setAttribute('data-vt-drag-init', 'true');

      var isDown = false;
      var startX = 0;
      var scrollLeft = 0;

      el.addEventListener('mousedown', function(e) {
        isDown = true;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      });

      el.addEventListener('mouseleave', function() {
        isDown = false;
        el.style.cursor = 'grab';
        el.style.userSelect = '';
      });

      el.addEventListener('mouseup', function() {
        isDown = false;
        el.style.cursor = 'grab';
        el.style.userSelect = '';
      });

      el.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - el.offsetLeft;
        var walk = (x - startX) * 1.5;
        el.scrollLeft = scrollLeft - walk;
      });
    });

    // Scroll indicators: an edge shows while there is more past it. Said at
    // once (a list that overflows says so before anyone scrolls), on scroll,
    // and again when the box or what is in it changes size.
    function watch(indicator, scroll, update) {
      update();
      scroll.addEventListener('scroll', update, { passive: true });
      if (typeof ResizeObserver !== 'undefined') {
        var sizes = new ResizeObserver(update);
        var observeChildren = function() {
          sizes.observe(scroll);
          for (var i = 0; i < scroll.children.length; i++) sizes.observe(scroll.children[i]);
        };
        observeChildren();
        if (typeof MutationObserver !== 'undefined') {
          new MutationObserver(function() { observeChildren(); update(); })
            .observe(scroll, { childList: true, subtree: true, characterData: true });
        }
      } else {
        window.addEventListener('resize', update);
      }
    }

    // Scroll indicators — vertical
    document.querySelectorAll('.vt-scroll-indicator').forEach(function(indicator) {
      if (indicator.hasAttribute('data-vt-indicator-init')) return;
      indicator.setAttribute('data-vt-indicator-init', 'true');

      var scroll = indicator.querySelector('.vt-scroll, .vt-scroll-hidden, .vt-scroll-autohide');
      if (!scroll) return;

      watch(indicator, scroll, function() {
        var st = scroll.scrollTop;
        var sh = scroll.scrollHeight;
        var ch = scroll.clientHeight;
        indicator.classList.toggle('vt-show-top', st > 8);
        indicator.classList.toggle('vt-show-bottom', st < sh - ch - 8);
      });
    });

    // Scroll indicators — horizontal
    document.querySelectorAll('.vt-scroll-indicator-h').forEach(function(indicator) {
      if (indicator.hasAttribute('data-vt-indicator-h-init')) return;
      indicator.setAttribute('data-vt-indicator-h-init', 'true');

      var scroll = indicator.querySelector('.vt-scroll, .vt-scroll-hidden, .vt-scroll-autohide, [class*="vt-overflow-x"]');
      if (!scroll) return;

      watch(indicator, scroll, function() {
        var sl = scroll.scrollLeft;
        var sw = scroll.scrollWidth;
        var cw = scroll.clientWidth;
        indicator.classList.toggle('vt-show-left', sl > 8);
        indicator.classList.toggle('vt-show-right', sl < sw - cw - 8);
      });
    });
  }
};

// VtNumberInput — increment/decrement by the input's step, within its min/max
var VtNumberInput = {
  init: function() {
    document.querySelectorAll('[data-vt-number-input]').forEach(function(wrapper) {
      if (wrapper.hasAttribute('data-vt-ni-bound')) return;
      wrapper.setAttribute('data-vt-ni-bound', 'true');

      var input = wrapper.querySelector('[data-vt-number-value]');
      var decBtn = wrapper.querySelector('[data-vt-action="decrement"]');
      var incBtn = wrapper.querySelector('[data-vt-action="increment"]');
      if (!input) return;

      function toNumber(value, fallback) {
        // `parseFloat(x) || fallback` treats a legitimate 0 as missing.
        var n = parseFloat(value);
        return isFinite(n) ? n : fallback;
      }

      // Digits after the point: 0.1 → 1, 2.5e-3 → 4. A sum of steps is rounded
      // to these, so 0.1 + 0.2 shows 0.3, not 0.30000000000000004.
      function decimals(n) {
        var text = String(n);
        var e = text.indexOf('e-');
        if (e >= 0) return parseInt(text.slice(e + 2), 10) + decimals(text.slice(0, e));
        var dot = text.indexOf('.');
        return dot < 0 ? 0 : text.length - dot - 1;
      }

      function bounds() {
        return {
          min: input.hasAttribute('min') ? toNumber(input.min, -Infinity) : -Infinity,
          max: input.hasAttribute('max') ? toNumber(input.max, Infinity) : Infinity
        };
      }

      // As the browser has it: no step, a bad one or "any" is 1.
      function stepSize() {
        var s = toNumber(input.getAttribute('step'), 1);
        return s > 0 ? s : 1;
      }

      function updateButtons() {
        var val = toNumber(input.value, 0);
        var b = bounds();
        if (decBtn) decBtn.disabled = val <= b.min;
        if (incBtn) incBtn.disabled = val >= b.max;
      }

      // One step up or down, on the steps counted from min (or 0), as the
      // browser's own stepper does: 7 with step 5 from 0 goes to 10 or 5.
      function step(direction) {
        var b = bounds();
        var size = stepSize();
        var base = isFinite(b.min) ? b.min : 0;
        var val = toNumber(input.value, base);
        var places = Math.max(decimals(size), decimals(base), decimals(val));
        var at = (val - base) / size;
        var near = Math.round(at);
        // Already on a step (within rounding): move one; between steps: to the next one that way.
        var onStep = Math.abs(at - near) < 1e-9;
        var index = onStep ? near + direction : direction > 0 ? Math.ceil(at) : Math.floor(at);
        var next = Math.min(Math.max(base + index * size, b.min), b.max);
        input.value = String(Number(next.toFixed(places)));
        updateButtons();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (decBtn) decBtn.addEventListener('click', function() { step(-1); });
      if (incBtn) incBtn.addEventListener('click', function() { step(1); });

      input.addEventListener('change', function() {
        var b = bounds();
        // An empty/invalid field falls back to the lower bound when there is
        // one, otherwise to 0 — never to -Infinity.
        var val = toNumber(input.value, isFinite(b.min) ? b.min : 0);
        var held = Math.min(Math.max(val, b.min), b.max);
        // What was typed stays as typed ("1.50") unless it is out of bounds or not a number.
        if (held !== val || !isFinite(parseFloat(input.value))) input.value = String(held);
        updateButtons();
      });

      updateButtons();
    });
  }
};

// VtPopover — toggle popover panels with outside-click close
var VtPopover = {
  // Shown open on purpose — a docs example's `open`, a preview inside [inert],
  // `data-vt-keep-open` — is closed neither by an outside click nor by Escape.
  pinned: function(el) { return Boolean(el.closest('[data-vt-keep-open], .open, [inert]')); },

  init: function() {
    document.querySelectorAll('[data-vt-popover-trigger]').forEach(function(btn) {
      var id = btn.getAttribute('data-vt-popover-trigger');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      if (id) btn.setAttribute('aria-controls', id);

      btn.onclick = function(e) {
        e.stopPropagation();
        var el = id ? document.getElementById(id) : null;
        if (!el) return;

        var isOpen = el.classList.contains('vt-open');

        document.querySelectorAll('.vt-popover-content').forEach(function(p) {
          if (!VtPopover.pinned(p)) p.classList.remove('vt-open');
        });
        document.querySelectorAll('[data-vt-popover-trigger]').forEach(function(t) {
          t.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          el.classList.add('vt-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      };
    });

    if (!window.__vtPopoverEvents) {
      window.__vtPopoverEvents = true; // per window: <body> is replaced on a client-side swap, the document listener is not
      document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.closest('.vt-popover-content') && !target.closest('[data-vt-popover-trigger]')) {
          document.querySelectorAll('.vt-popover-content').forEach(function(p) {
            if (!VtPopover.pinned(p)) p.classList.remove('vt-open');
          });
          document.querySelectorAll('[data-vt-popover-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.vt-popover-content').forEach(function(p) {
            if (!VtPopover.pinned(p)) p.classList.remove('vt-open');
          });
          document.querySelectorAll('[data-vt-popover-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }
  }
};

// VtSelect — custom select dropdown with single selection
var VtSelect = {
  init: function() {
    document.querySelectorAll('.vt-select-wrapper').forEach(function(wrapper) {
      var trigger = wrapper.querySelector('.vt-select-trigger');
      var dropdown = wrapper.querySelector('.vt-select-dropdown');
      if (!trigger || !dropdown) return;
      if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', String(dropdown.classList.contains('open')));
      dropdown.setAttribute('role', 'listbox');
      dropdown.querySelectorAll('.vt-select-item').forEach(function(item) {
        item.setAttribute('role', 'option');
        item.setAttribute('tabindex', '-1');
      });
    });

    if (window.__vtSelectEvents) return;
    window.__vtSelectEvents = true; // per window: <body> is replaced on a client-side swap, the document listener is not

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.vt-select-wrapper')) {
        document.querySelectorAll('.vt-select-dropdown').forEach(function(d) {
          VtSelect.setOpen(d, false);
        });
      }
    });

    document.addEventListener('keydown', function(e) {
      var target = e.target;
      if (!target || !target.closest) return;
      var trigger = target.closest('.vt-select-trigger');
      var current = target.closest('.vt-select-item');
      if (!trigger && !current) return;
      var wrapper = target.closest('.vt-select-wrapper');
      var dropdown = wrapper && wrapper.querySelector('.vt-select-dropdown');
      if (!dropdown) return;
      var button = trigger || wrapper.querySelector('.vt-select-trigger');
      var items = Array.prototype.slice.call(dropdown.querySelectorAll('.vt-select-item'));

      if (e.key === 'Escape') {
        if (!dropdown.classList.contains('open')) return;
        e.preventDefault();
        VtSelect.setOpen(dropdown, false);
        if (button) button.focus();
      } else if (trigger && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
        e.preventDefault();
        VtSelect.setOpen(dropdown, true);
        var chosen = dropdown.querySelector('.vt-select-item.selected') || items[0];
        if (chosen) chosen.focus();
      } else if (current) {
        var at = items.indexOf(current);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(at + 1, items.length - 1)].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(at - 1, 0)].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
        else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          current.click();
          if (button) button.focus();
        } else if (e.key === 'Tab') {
          VtSelect.setOpen(dropdown, false);
        }
      }
    });
  },

  setOpen: function(dropdown, open) {
    dropdown.classList.toggle('open', open);
    var wrapper = dropdown.closest('.vt-select-wrapper');
    var trigger = wrapper && wrapper.querySelector('.vt-select-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
  }
};

// toggleSelect — called via onclick in HTML
function toggleSelect(id) {
  var dropdown = document.getElementById(id);
  document.querySelectorAll('.vt-select-dropdown').forEach(function(d) {
    if (d.id !== id) VtSelect.setOpen(d, false);
  });
  VtSelect.setOpen(dropdown, !dropdown.classList.contains('open'));
}

// selectItem — called via onclick in HTML
function selectItem(id, triggerId, value) {
  document.getElementById(triggerId).querySelector('span').textContent = value;
  document.getElementById(triggerId).querySelector('span').classList.remove('placeholder');
  var dropdown = document.getElementById(id);
  dropdown.querySelectorAll('.vt-select-item').forEach(function(i) {
    i.classList.remove('selected');
  });
  dropdown.querySelectorAll('.vt-select-item').forEach(function(i) {
    if (i.textContent.trim() === value) i.classList.add('selected');
  });
  VtSelect.setOpen(dropdown, false);
}

// Inline `onclick` looks these up on window. In the shipped bundle the files
// are concatenated at top level, where a function declaration is already
// global; under a bundler it would be module-scoped, so pin them explicitly —
// the same thing dialog.js, combobox.js and toast.js do.
if (typeof window !== 'undefined') veritheme.toggleSelect = toggleSelect;
if (typeof window !== 'undefined') veritheme.selectItem = selectItem;

// VtSlider — paints the filled track portion based on value/min/max
var VtSlider = {
  init: function() {
    document.querySelectorAll('.vt-slider').forEach(function(input) {
      if (input.hasAttribute('data-vt-slider-init')) return;
      input.setAttribute('data-vt-slider-init', 'true');

      function update() {
        var min = parseFloat(input.min || '0');
        var max = parseFloat(input.max || '100');
        var val = parseFloat(input.value || '0');
        var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
        input.style.setProperty('--vt-slider-progress', pct + '%');
      }

      update();
      input.addEventListener('input', update);
    });
  }
};

// VtToast — programmatic toast notifications
//
//   veritheme.showToast({ title: 'Saved', description: 'Your changes are live.', kind: 'success' })
//   veritheme.showToast({ title: 'Message archived', action: { label: 'Undo', onClick: restore } })
//   veritheme.showToast('success')   // a demo toast with stock copy, for docs and previews
//
// `kind` is 'default' | 'success' | 'error'. `duration` is in milliseconds (4000);
// 0 keeps the toast until it is closed. The call returns the toast element.
//
// Motion (components/toast.json, `motion`): the toast comes in from
// .vt-toast-closed and closing puts it back there, then removes it once the
// transition ends (a timer covers a transition that never fires). With
// prefers-reduced-motion it appears and goes at once.
var VtToast = {
  _count: 0,

  ICONS: {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-toast-icon" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-toast-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
  },

  // Stock copy for `showToast('success')`: what the docs and previews show.
  DEMOS: {
    default: { title: 'Scheduled: Catch up', description: 'Friday, February 14, 2026 at 5:57 PM', action: { label: 'Undo' } },
    success: { kind: 'success', title: 'Success', description: 'Your changes have been saved.' },
    error: { kind: 'error', title: 'Error', description: 'Something went wrong. Please try again.', action: { label: 'Retry' } },
    action: { title: 'Event created', description: 'Sunday, December 03, 2023', action: { label: 'Undo' } }
  },

  reducedMotion: function() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  },

  // The longest transition on the element, in ms (computed values are seconds).
  transitionMs: function(el) {
    var style = getComputedStyle(el);
    var delays = style.transitionDelay.split(',');
    return style.transitionDuration.split(',').reduce(function(max, value, i) {
      var ms = (parseFloat(value) || 0) * 1000 + (parseFloat(delays[i % delays.length]) || 0) * 1000;
      return Math.max(max, ms);
    }, 0);
  },

  container: function() {
    var container = document.getElementById('toast-container');
    if (!container) {
      // Out-of-the-box: create the host container on first use.
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'vt-fixed vt-bottom-4 vt-right-4 vt-z-50 vt-flex vt-flex-col vt-items-end';
      document.body.appendChild(container);
    }
    return container;
  },

  show: function(input) {
    var options = typeof input === 'string' || input == null
      ? (VtToast.DEMOS[input] || VtToast.DEMOS.default)
      : input;
    var kind = options.kind === 'success' || options.kind === 'error' ? options.kind : 'default';

    var toast = document.createElement('div');
    toast.id = 'toast-' + (++VtToast._count);
    // The toast's own classes (components/toast.json): the look lives in the CSS.
    toast.className = 'vt-toast vt-mb-2' + (kind === 'success' ? ' vt-toast-success' : kind === 'error' ? ' vt-toast-danger' : '');
    toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', kind === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');

    // The icon is the bundle's own markup; the caller's text goes in as text,
    // never as HTML, so a title built from user input cannot inject markup.
    if (VtToast.ICONS[kind]) toast.insertAdjacentHTML('beforeend', VtToast.ICONS[kind]);
    var content = document.createElement('div');
    content.className = 'vt-toast-content';
    [['vt-toast-title', options.title], ['vt-toast-description', options.description]].forEach(function(part) {
      if (part[1] == null || part[1] === '') return;
      var line = document.createElement('p');
      line.className = part[0];
      line.textContent = String(part[1]);
      content.appendChild(line);
    });
    toast.appendChild(content);

    var closed = false;
    var dismiss = function() {
      if (closed) return;
      closed = true;
      if (VtToast.reducedMotion() || !toast.isConnected) { toast.remove(); return; }
      var timer;
      var done = function() {
        clearTimeout(timer);
        toast.removeEventListener('transitionend', onEnd);
        toast.remove();
      };
      var onEnd = function(event) { if (event.target === toast && event.propertyName === 'opacity') done(); };
      toast.addEventListener('transitionend', onEnd);
      toast.classList.add('vt-toast-closed');
      timer = setTimeout(done, VtToast.transitionMs(toast) + 50);
    };
    if (options.action && options.action.label) {
      var action = document.createElement('button');
      action.type = 'button';
      action.className = 'vt-btn vt-btn-bordered vt-btn-sm';
      action.textContent = String(options.action.label);
      action.addEventListener('click', function(event) {
        if (typeof options.action.onClick === 'function') options.action.onClick(event);
        dismiss();
      });
      toast.appendChild(action);
    }
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'vt-btn vt-btn-ghost vt-btn-icon vt-btn-sm';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = VtToast.ICONS.close;
    close.addEventListener('click', dismiss);
    toast.appendChild(close);

    var animate = !VtToast.reducedMotion();
    if (animate) toast.classList.add('vt-toast-closed');
    VtToast.container().appendChild(toast);
    if (animate) {
      void toast.offsetWidth; // commit the closed state, so the class change transitions
      toast.classList.remove('vt-toast-closed');
    }
    var duration = typeof options.duration === 'number' ? options.duration : 4000;
    if (duration > 0) setTimeout(dismiss, duration);
    return toast;
  },

  init: function() {
    // Expose showToast globally for onclick use
    veritheme.showToast = function(input) { return VtToast.show(input); };
  }
};

// VtProgress — a progress bar's value.
//
//   <div class="vt-progress" data-vt-progress="64"><div class="vt-progress-bar"></div></div>
//   veritheme.setProgress(element, 80)        // 0–100, later, from script
//
// The attribute is read at load and whenever `veritheme.init()` runs. Both ways
// set the bar's width and the ARIA of a progressbar, so the value is also read
// to assistive technology. A bar with no attribute is left as it is.
var VtProgress = {
  set: function(progress, value) {
    if (!progress) return;
    var number = Math.max(0, Math.min(100, Number(value)));
    if (!isFinite(number)) return;
    var bar = progress.querySelector('.vt-progress-bar');
    if (bar) bar.style.width = number + '%';
    progress.setAttribute('data-vt-progress', String(number));
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', String(number));
  },

  init: function() {
    document.querySelectorAll('.vt-progress[data-vt-progress]').forEach(function(progress) {
      VtProgress.set(progress, progress.getAttribute('data-vt-progress'));
    });
    veritheme.setProgress = function(progress, value) { VtProgress.set(progress, value); };
  }
};

// VtSwitch — a switch that toggles itself.
//
//   <button type="button" class="vt-switch" data-vt-switch role="switch" aria-checked="false">
//     <span class="vt-switch-thumb"></span>
//   </button>
//   veritheme.setSwitch(element, true)        // later, from script
//
// A click flips `.vt-active` (the class that paints the track and moves the thumb)
// and `aria-checked`, then fires `vt-switch-change` with `detail.checked`, so the
// page only has to listen. The attribute is the opt-in: a switch without it is
// left to the page's own script, as before.
var VtSwitch = {
  set: function(el, on, silent) {
    if (!el) return;
    el.classList.toggle('vt-active', Boolean(on));
    el.setAttribute('role', 'switch');
    el.setAttribute('aria-checked', String(Boolean(on)));
    if (!silent) el.dispatchEvent(new CustomEvent('vt-switch-change', { bubbles: true, detail: { checked: Boolean(on) } }));
  },

  init: function() {
    document.querySelectorAll('.vt-switch[data-vt-switch]').forEach(function(el) {
      VtSwitch.set(el, el.classList.contains('vt-active') || el.getAttribute('aria-checked') === 'true', true);
    });
    veritheme.setSwitch = function(el, on) { VtSwitch.set(el, on); };
    if (VtSwitch.bound) return;
    VtSwitch.bound = true;
    document.addEventListener('click', function(event) {
      var el = event.target.closest ? event.target.closest('.vt-switch[data-vt-switch]') : null;
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      VtSwitch.set(el, !el.classList.contains('vt-active'));
    });
  }
};

// VtDismiss — a close button that removes its alert or banner.
//
//   <div class="vt-alert vt-alert-info" role="alert">
//     …
//     <button type="button" class="vt-btn vt-btn-ghost vt-btn-sm vt-btn-icon" data-vt-dismiss aria-label="Dismiss">…</button>
//   </div>
//   veritheme.dismiss(element)                 // later, from script
//
// A click fires `vt-dismiss` on the alert or banner before it goes (it bubbles
// and is cancelable: `event.preventDefault()` keeps it, to animate it out or to
// ask first), then removes it. Focus that was inside does not fall to the page:
// it moves to the next control after the removed block, or the one before it.
// The attribute is the opt-in: a close button without it is left to the page's
// own script, as before.
var VtDismiss = {
  SELECTOR: '.vt-alert, .vt-banner',

  focusable: function() {
    return Array.prototype.filter.call(
      document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function(el) { return el.offsetParent !== null || el === document.activeElement; }
    );
  },

  // The control focus goes to when `box` leaves: the first after it, else the last before it.
  nextFocus: function(box) {
    var list = VtDismiss.focusable().filter(function(el) { return !box.contains(el); });
    for (var i = 0; i < list.length; i++) {
      if (box.compareDocumentPosition(list[i]) & Node.DOCUMENT_POSITION_FOLLOWING) return list[i];
    }
    return list.length ? list[list.length - 1] : null;
  },

  dismiss: function(box, trigger) {
    if (!box || !box.parentNode) return false;
    var event = new CustomEvent('vt-dismiss', { bubbles: true, cancelable: true, detail: { trigger: trigger || null } });
    if (!box.dispatchEvent(event)) return false;
    var hadFocus = box.contains(document.activeElement);
    var next = hadFocus ? VtDismiss.nextFocus(box) : null;
    var parent = box.parentNode;
    parent.removeChild(box);
    if (hadFocus) {
      if (next) next.focus();
      else {
        // Nothing focusable is left: the block's container keeps the place.
        if (!parent.hasAttribute('tabindex')) parent.setAttribute('tabindex', '-1');
        parent.focus();
      }
    }
    return true;
  },

  init: function() {
    veritheme.dismiss = function(el) {
      var box = el && el.closest ? el.closest(VtDismiss.SELECTOR) : null;
      return VtDismiss.dismiss(box || el, null);
    };
    if (VtDismiss.bound) return;
    VtDismiss.bound = true;
    document.addEventListener('click', function(event) {
      var button = event.target.closest ? event.target.closest('[data-vt-dismiss]') : null;
      if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
      var box = button.closest(VtDismiss.SELECTOR);
      if (box) VtDismiss.dismiss(box, button);
    });
  }
};

// VtRating — a rating the reader sets.
//
//   <div class="vt-rating" data-vt-rating aria-label="Rate this answer">
//     <span class="vt-star vt-filled"><svg><!-- filled star --></svg></span>
//     <span class="vt-star"><svg><!-- star outline --></svg></span>
//     …
//   </div>
//   veritheme.setRating(element, 4)            // later, from script
//
// The row is one control, a slider from 0 to the number of stars: it takes the
// focus once, the arrow keys move the value, Home and End go to either end, and
// aria-valuenow / aria-valuetext say it. (A radio group would need each star to
// be an option of its own, focused in turn; here the stars are a scale.)
// Hovering previews the value, a click sets it; `vt-rating-change` fires with
// `detail.value`. With `data-vt-rating-half` the value moves by halves, drawn as
// the component draws them (`.vt-rating-half`). The filled and the empty star
// are taken from the markup itself, so a heart rating stays hearts. The
// attribute is the opt-in: a rating without it is a picture of a value, as before.
var VtRating = {
  stars: function(root) {
    return Array.prototype.filter.call(root.children, function(el) { return el.classList.contains('vt-star'); });
  },

  // The two drawings, read once from the markup: a filled star and an empty one.
  shapes: function(root) {
    if (root.__vtShapes) return root.__vtShapes;
    var stars = VtRating.stars(root);
    var filled = stars.filter(function(s) { return s.classList.contains('vt-filled'); })[0];
    var empty = stars.filter(function(s) { return !s.classList.contains('vt-filled') && !s.classList.contains('vt-rating-half'); })[0];
    var half = stars.filter(function(s) { return s.classList.contains('vt-rating-half'); })[0];
    var fillIn = half && half.querySelector('.vt-filled');
    root.__vtShapes = {
      filled: filled ? filled.innerHTML : (fillIn ? fillIn.innerHTML : null),
      empty: empty ? empty.innerHTML : (half && half.firstElementChild && !half.firstElementChild.classList.contains('vt-filled') ? half.firstElementChild.outerHTML : null),
    };
    return root.__vtShapes;
  },

  valueOf: function(root) {
    var attr = parseFloat(root.getAttribute('data-vt-rating-value'));
    if (!isNaN(attr)) return attr;
    var stars = VtRating.stars(root);
    var value = 0;
    stars.forEach(function(s) {
      if (s.classList.contains('vt-rating-half')) value += 0.5;
      else if (s.classList.contains('vt-filled')) value += 1;
    });
    return value;
  },

  step: function(root) { return root.hasAttribute('data-vt-rating-half') ? 0.5 : 1; },

  // Draws a value on the stars (the committed one, or a preview while hovering).
  paint: function(root, value) {
    var shapes = VtRating.shapes(root);
    VtRating.stars(root).forEach(function(star, i) {
      var full = value >= i + 1;
      var half = !full && value >= i + 0.5 && shapes.filled && shapes.empty;
      var want = full ? 'full' : half ? 'half' : 'empty';
      if (star.__vtLook === want) return;
      star.__vtLook = want;
      star.classList.toggle('vt-filled', full);
      star.classList.toggle('vt-rating-half', Boolean(half));
      if (!shapes.filled || !shapes.empty) return;
      star.innerHTML = full ? shapes.filled : half ? shapes.empty + '<span class="vt-star vt-filled">' + shapes.filled + '</span>' : shapes.empty;
    });
  },

  set: function(root, value, silent) {
    if (!root) return;
    var max = VtRating.stars(root).length;
    var step = VtRating.step(root);
    var v = Math.max(0, Math.min(max, Math.round(Number(value) / step) * step));
    root.__vtValue = v;
    root.setAttribute('data-vt-rating-value', String(v));
    root.setAttribute('aria-valuenow', String(v));
    root.setAttribute('aria-valuetext', v + ' of ' + max + (max === 1 ? ' star' : ' stars'));
    VtRating.paint(root, v);
    if (!silent) root.dispatchEvent(new CustomEvent('vt-rating-change', { bubbles: true, detail: { value: v } }));
  },

  // The value under the pointer: the star it is over, or half of it.
  pointed: function(root, event) {
    var stars = VtRating.stars(root);
    var rtl = getComputedStyle(root).direction === 'rtl';
    for (var i = 0; i < stars.length; i++) {
      var box = stars[i].getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right) continue;
      if (VtRating.step(root) === 0.5) {
        var startHalf = rtl ? event.clientX > box.left + box.width / 2 : event.clientX < box.left + box.width / 2;
        if (startHalf) return i + 0.5;
      }
      return i + 1;
    }
    return null;
  },

  disabled: function(root) { return root.getAttribute('aria-disabled') === 'true' || root.getAttribute('aria-readonly') === 'true'; },

  init: function() {
    document.querySelectorAll('.vt-rating[data-vt-rating]').forEach(function(root) {
      if (root.__vtRating) return;
      root.__vtRating = true;
      // A slider, no longer a picture of a value.
      root.setAttribute('role', 'slider');
      if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
      if (!root.hasAttribute('aria-label') || /^Rated /.test(root.getAttribute('aria-label'))) root.setAttribute('aria-label', 'Rating');
      root.setAttribute('aria-valuemin', '0');
      root.setAttribute('aria-valuemax', String(VtRating.stars(root).length));
      VtRating.shapes(root);
      VtRating.set(root, VtRating.valueOf(root), true);
      // On the row itself: a preview redraws the stars, and the one under the
      // pointer is no longer in the page by the time the pointer leaves it.
      root.addEventListener('mouseleave', function() { VtRating.paint(root, root.__vtValue || 0); });
    });
    veritheme.setRating = function(el, value) { VtRating.set(el, value); };
    if (VtRating.bound) return;
    VtRating.bound = true;
    var rootOf = function(target) { return target && target.closest ? target.closest('.vt-rating[data-vt-rating]') : null; };
    // The row being previewed: a preview redraws its stars, and the one under the
    // pointer is gone from the page by the time the pointer leaves, so leaving is
    // told by the next move outside the row, not by a leave event on it.
    var previewing = null;
    document.addEventListener('mousemove', function(event) {
      var root = rootOf(event.target);
      if (previewing && previewing !== root) { VtRating.paint(previewing, previewing.__vtValue || 0); previewing = null; }
      if (!root || VtRating.disabled(root)) return;
      // Over a star: its value; between two (the gap): the value that is set.
      var v = VtRating.pointed(root, event);
      VtRating.paint(root, v !== null ? v : root.__vtValue || 0);
      previewing = root;
    });
    document.addEventListener('click', function(event) {
      var root = rootOf(event.target);
      if (!root || VtRating.disabled(root)) return;
      var v = VtRating.pointed(root, event);
      if (v !== null) VtRating.set(root, v);
    });
    document.addEventListener('keydown', function(event) {
      var root = event.target && event.target.matches && event.target.matches('.vt-rating[data-vt-rating]') ? event.target : null;
      if (!root || VtRating.disabled(root)) return;
      var step = VtRating.step(root);
      var rtl = getComputedStyle(root).direction === 'rtl';
      var now = root.__vtValue || 0;
      var max = VtRating.stars(root).length;
      var next = null;
      if (event.key === 'ArrowUp' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = now + step;
      else if (event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = now - step;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = max;
      if (next === null) return;
      event.preventDefault();
      VtRating.set(root, next);
    });
  }
};

// VtFileUpload — a drop zone that opens the file picker and says what was chosen.
//
//   <div class="vt-file-upload" data-vt-file-upload>
//     <svg class="vt-file-upload-icon">…</svg>
//     <p class="vt-file-upload-title">Drop files here</p>
//     <p class="vt-file-upload-hint">PNG, JPG or PDF, up to 10 MB</p>
//     <button type="button" class="vt-btn vt-btn-primary">Browse files</button>
//     <input type="file" multiple hidden>
//   </div>
//   veritheme.openFileUpload(element)          // the picker, from script
//
// Dragging files over the zone highlights it (`.vt-dragover`, the component's Dragover state);
// dropping them, or choosing them in the picker, fires `vt-file-upload-change`
// with `detail.files` (an array of File). A click on the zone opens the picker.
// The zone is reached with Tab and opened with Enter or Space, unless it holds a
// button of its own (Browse files): that button is the control then, not a
// button inside a button. The files are the page's to show: the chips of
// File upload item are not drawn here. aria-disabled="true" on the zone turns it
// all off, as on the other controls that are not native ones. The attribute is
// the opt-in: a zone without it is left to the page.
var VtFileUpload = {
  inputOf: function(zone) { return zone.querySelector('input[type="file"]'); },

  off: function(zone) { return zone.getAttribute('aria-disabled') === 'true'; },

  open: function(zone) {
    var input = zone && VtFileUpload.inputOf(zone);
    if (input && !VtFileUpload.off(zone)) input.click();
  },

  report: function(zone, files) {
    zone.dispatchEvent(new CustomEvent('vt-file-upload-change', { bubbles: true, detail: { files: Array.prototype.slice.call(files || []) } }));
  },

  init: function() {
    document.querySelectorAll('.vt-file-upload[data-vt-file-upload]').forEach(function(zone) {
      if (zone.__vtFileUpload) return;
      zone.__vtFileUpload = true;
      // A control of its own only when nothing inside is one.
      if (!zone.querySelector('button, a[href]') && !zone.hasAttribute('tabindex')) {
        zone.setAttribute('tabindex', '0');
        zone.setAttribute('role', 'button');
      }
      var input = VtFileUpload.inputOf(zone);
      if (input) input.addEventListener('change', function() { VtFileUpload.report(zone, input.files); });
    });
    veritheme.openFileUpload = function(el) { VtFileUpload.open(el && el.closest ? el.closest('.vt-file-upload') || el : el); };
    if (VtFileUpload.bound) return;
    VtFileUpload.bound = true;
    var zoneOf = function(target) { return target && target.closest ? target.closest('.vt-file-upload[data-vt-file-upload]') : null; };
    document.addEventListener('click', function(event) {
      var zone = zoneOf(event.target);
      if (!zone || VtFileUpload.off(zone)) return;
      // The input's own click (the one this opens) is not a click on the zone.
      if (event.target.matches('input[type="file"]')) return;
      // A link of the page's own inside the zone does what it does.
      if (event.target.closest('a[href]')) return;
      VtFileUpload.open(zone);
    });
    document.addEventListener('keydown', function(event) {
      var zone = event.target && event.target.matches && event.target.matches('.vt-file-upload[data-vt-file-upload][role="button"]') ? event.target : null;
      if (!zone || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      VtFileUpload.open(zone);
    });
    // Drag over: a counter, since entering a child leaves the parent.
    document.addEventListener('dragenter', function(event) {
      var zone = zoneOf(event.target);
      if (!zone || VtFileUpload.off(zone)) return;
      event.preventDefault();
      zone.__vtDepth = (zone.__vtDepth || 0) + 1;
      zone.classList.add('vt-dragover');
    });
    document.addEventListener('dragover', function(event) {
      var zone = zoneOf(event.target);
      if (!zone || VtFileUpload.off(zone)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    document.addEventListener('dragleave', function(event) {
      var zone = zoneOf(event.target);
      if (!zone) return;
      zone.__vtDepth = Math.max(0, (zone.__vtDepth || 1) - 1);
      if (!zone.__vtDepth) zone.classList.remove('vt-dragover');
    });
    document.addEventListener('drop', function(event) {
      var zone = zoneOf(event.target);
      if (!zone) return;
      event.preventDefault();
      zone.__vtDepth = 0;
      zone.classList.remove('vt-dragover');
      if (VtFileUpload.off(zone)) return;
      var files = event.dataTransfer ? event.dataTransfer.files : [];
      // The input holds them too, for a form that posts it.
      var input = VtFileUpload.inputOf(zone);
      if (input && files && files.length) { try { input.files = files; } catch (error) { /* a browser that will not take them */ } }
      VtFileUpload.report(zone, files);
    });
  }
};

// VtDialog — modal dialog with focus trap and keyboard support
var VtDialog = {
  init: function() {
    // Expose functions globally for onclick use
    veritheme.openDialog = function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el._keyHandler) document.removeEventListener('keydown', el._keyHandler);
      el._previousFocus = document.activeElement;
      el.classList.add('vt-open');
      el.removeAttribute('aria-hidden');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      var focusable = VtDialog._focusable(el)[0];
      if (focusable) focusable.focus();
      el._keyHandler = function(e) {
        if (e.key === 'Escape') { veritheme.closeDialog(id); return; }
        if (e.key !== 'Tab') return;
        var all = VtDialog._focusable(el);
        if (!all.length) return;
        var first = all[0];
        var last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener('keydown', el._keyHandler);
    };

    veritheme.closeDialog = function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('vt-open');
      el.setAttribute('aria-hidden', 'true');
      if (el._keyHandler) document.removeEventListener('keydown', el._keyHandler);
      if (el._previousFocus && typeof el._previousFocus.focus === 'function') {
        el._previousFocus.focus();
      }
      el._keyHandler = null;
      el._previousFocus = null;
    };
  },

  /**
   * The elements inside the dialog that can actually take focus. A disabled
   * or hidden control matches the selector but never becomes activeElement,
   * so counting it as "last" let Tab walk out of the dialog.
   */
  _focusable: function(el) {
    var nodes = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return Array.prototype.filter.call(nodes, function(n) {
      if (n.disabled || n.getAttribute('aria-hidden') === 'true') return false;
      if (n.hasAttribute('inert') || (n.closest && n.closest('[inert]'))) return false;
      return !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    });
  }
};

// VtTreeView — expandable/collapsible tree nodes
var VtTreeView = {
  init: function() {
    document.querySelectorAll('[data-vt-tree]').forEach(function(tree) {
      if (tree.hasAttribute('data-vt-tree-bound')) return;
      tree.setAttribute('data-vt-tree-bound', 'true');

      tree.querySelectorAll('[data-vt-tree-branch]').forEach(function(branch) {
        var toggle = branch.querySelector(':scope > .vt-tree-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function() {
          branch.classList.toggle('open');
        });
      });
    });
  }
};

// VtFields — small field behaviours declared with data-attributes:
// `[data-vt-pricing]` period switches and `[data-vt-otp]` groups.
var VtFields = {
  init: function() {
    VtFields.initPricing();
    VtFields.initOtp();
  },

  // Monthly/yearly switch: prices and copy come from data-attributes on the
  // price and description nodes so the markup stays the source of truth.
  initPricing: function() {
    document.querySelectorAll('[data-vt-pricing]').forEach(function(group) {
      if (group.dataset.vtPricingBound) return;
      group.dataset.vtPricingBound = 'true';

      // One switch drives every price and description in its group: a single
      // card, or a whole row of plans under one Monthly/Yearly switch. Each
      // node carries its own data-vt-monthly / data-vt-yearly.
      var toggle = group.querySelector('[data-vt-pricing-toggle]');
      var nodes = Array.from(group.querySelectorAll('[data-vt-pricing-price], [data-vt-pricing-description]')).map(function(node) {
        var monthly = node.dataset.vtMonthly || node.textContent.trim();
        return { node: node, monthly: monthly, yearly: node.dataset.vtYearly || monthly };
      });
      if (!toggle || !group.querySelector('[data-vt-pricing-price]')) return;

      toggle.addEventListener('click', function() {
        var isYearly = toggle.getAttribute('aria-checked') !== 'true';
        toggle.setAttribute('aria-checked', String(isYearly));
        toggle.classList.toggle('vt-active', isYearly);
        // The switch colours itself by .vt-active; older markup recoloured it
        // with utilities, which would pin one colour — drop them.
        toggle.classList.remove('vt-bg-brand-fill', 'vt-bg-surface-moderate');
        nodes.forEach(function(entry) {
          entry.node.textContent = isYearly ? entry.yearly : entry.monthly;
        });
      });
    });
  },

  // One-time-code cells: typing advances, Backspace retreats, arrows move,
  // and a pasted code is spread across the remaining editable cells.
  initOtp: function() {
    document.querySelectorAll('[data-vt-otp]').forEach(function(group) {
      if (group.dataset.vtOtpBound) return;
      group.dataset.vtOtpBound = 'true';

      var cells = Array.from(group.querySelectorAll('.vt-otp-cell'));

      function editable(index) {
        return cells[index] && !cells[index].disabled && !cells[index].readOnly;
      }

      function announce() {
        group.dispatchEvent(new CustomEvent('vt:otpchange', {
          bubbles: true,
          detail: cells.map(function(cell) { return cell.value; }).join('')
        }));
      }

      function distribute(from, text) {
        var digits = text.replace(/\D/g, '');
        if (!digits) return;
        var last = from;
        var next = 0;
        for (var i = from; next < digits.length && i < cells.length; i++) {
          if (!editable(i)) continue;
          cells[i].value = digits[next++];
          last = i;
        }
        cells[Math.min(last + 1, cells.length - 1)].focus();
        announce();
      }

      cells.forEach(function(cell, index) {
        // Each digit is its own field; an author's own (e.g. translated) name wins.
        if (!cell.hasAttribute('aria-label') && !cell.hasAttribute('aria-labelledby')) {
          cell.setAttribute('aria-label', 'Digit ' + (index + 1) + ' of ' + cells.length);
        }
        cell.autocomplete = index === 0 ? 'one-time-code' : 'off';

        cell.addEventListener('input', function() {
          if (!editable(index)) return;
          cell.value = cell.value.replace(/\D/g, '').slice(-1);
          if (cell.value && editable(index + 1)) cells[index + 1].focus();
          announce();
        });

        cell.addEventListener('paste', function(e) {
          if (!editable(index)) return;
          e.preventDefault();
          distribute(index, e.clipboardData.getData('text'));
        });

        cell.addEventListener('keydown', function(e) {
          if (e.key === 'Backspace' && !cell.value && editable(index - 1)) {
            e.preventDefault();
            cells[index - 1].value = '';
            cells[index - 1].focus();
            announce();
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            var target = cells[index + (e.key === 'ArrowRight' ? 1 : -1)];
            if (target) {
              e.preventDefault();
              target.focus();
            }
          }
        });
      });
    });
  }
};

// VtCommand — filtering and keyboard navigation for the command palette.
// Markup wires the input with `oninput="veritheme.filterCommand(this)"` and
// `onkeydown="veritheme.navigateCommand(event, this)"`; Enter dispatches
// `vt:commandselect` on the highlighted item and updates an optional
// `[data-vt-command-status]` line inside the wrapper.
var VtCommand = {
  itemText: function(item) {
    return item.getAttribute('data-vt-value') || item.textContent.trim();
  },

  highlight: function(items, item) {
    items.forEach(function(candidate) { candidate.classList.toggle('vt-selected', candidate === item); });
    if (item) item.scrollIntoView({ block: 'nearest' });
  },

  filter: function(input) {
    var query = input.value.toLowerCase();
    var wrapper = input.closest('.vt-command-wrapper');
    var items = Array.from(wrapper.querySelectorAll('.vt-command-item'));
    var groups = wrapper.querySelectorAll('[data-vt-command-group]');
    var separators = wrapper.querySelectorAll('.vt-command-separator');
    var emptyEl = wrapper.querySelector('.vt-command-empty');
    var listEl = wrapper.querySelector('.vt-command-list');
    var totalVisible = 0;

    groups.forEach(function(group) {
      var groupVisible = 0;
      group.querySelectorAll('.vt-command-item').forEach(function(item) {
        var matches = VtCommand.itemText(item).toLowerCase().includes(query);
        item.classList.toggle('vt-hidden', !matches);
        if (matches) {
          groupVisible++;
          totalVisible++;
        }
      });
      group.style.display = groupVisible > 0 ? '' : 'none';
    });

    separators.forEach(function(separator) {
      separator.style.display = query ? 'none' : '';
    });

    if (emptyEl && listEl) {
      var empty = totalVisible === 0 && query;
      emptyEl.classList.toggle('vt-hidden', !empty);
      listEl.classList.toggle('vt-hidden', empty);
    }

    var firstVisible = items.find(function(item) { return !item.classList.contains('vt-hidden'); });
    VtCommand.highlight(items, firstVisible);
  },

  navigate: function(e, input) {
    var wrapper = input.closest('.vt-command-wrapper');
    var items = Array.from(wrapper.querySelectorAll('.vt-command-item')).filter(function(item) {
      return !item.classList.contains('vt-hidden');
    });
    var activeIndex = items.findIndex(function(item) { return item.classList.contains('vt-selected'); });

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      VtCommand.highlight(items, items[(activeIndex + 1) % items.length]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      VtCommand.highlight(items, items[(activeIndex - 1 + items.length) % items.length]);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      VtCommand.select(items[activeIndex], input);
    }
  },

  select: function(item, input) {
    var wrapper = input.closest('.vt-command-wrapper');
    // The label without the shortcut hint (⌘P) at the end of the item.
    var copy = item.cloneNode(true);
    copy.querySelectorAll('.vt-command-shortcut').forEach(function(kbd) { kbd.remove(); });
    var label = copy.textContent.trim();
    var status = wrapper.querySelector('[data-vt-command-status]');
    if (status) status.textContent = 'Selected: ' + label;
    item.dispatchEvent(new CustomEvent('vt:commandselect', { bubbles: true, detail: VtCommand.itemText(item) }));
    input.value = '';
    VtCommand.filter(input);
  },

  init: function() {
    // Global names used by inline handlers in the docs and copied examples.
    veritheme.filterCommand = VtCommand.filter;
    veritheme.navigateCommand = VtCommand.navigate;
  }
};

// VtSidebarNav — collapsible sections of a sidebar nav (.vt-side-nav, or the
// older [data-vt-sidebar-demo] wrapper): the section's toggle button opens and
// closes it; the CSS shows .vt-side-nav-children and turns the chevron.
var VtSidebarNav = {
  init: function() {
    document.querySelectorAll('.vt-side-nav, [data-vt-sidebar-demo]').forEach(function(nav) {
      if (nav.dataset.vtSidebarBound) return;
      nav.dataset.vtSidebarBound = 'true';

      nav.querySelectorAll('[data-vt-sidebar-collapsible]').forEach(function(section) {
        var toggle = section.querySelector(':scope > button');
        if (!toggle) return;
        toggle.setAttribute('aria-expanded', String(section.classList.contains('open')));
        toggle.addEventListener('click', function() {
          var open = section.classList.toggle('open');
          toggle.setAttribute('aria-expanded', String(open));
        });
      });
    });
  }
};

// VtStates — one page, several states of it (the artboards of one screen in Figma).
//
//   <main data-vt-states="workspace typing chat-answer" data-vt-states-url>
//     <template data-vt-show="chat-thinking" data-vt-go-after="chat-answer" data-vt-go-delay="800"></template>
//     <div data-vt-show="workspace typing">…</div>           shown in these states only
//     <div>…<button data-vt-go="typing">…</button></div>  no data-vt-show: in every state
//   </main>
//   veritheme.showState('typing')                         later, from script
//
//   data-vt-states="a b"     the states, the first one shown at load
//   data-vt-states-url       the state follows `?state=` (read at load, written on change)
//   data-vt-show="a b"       the element belongs to states a and b; hidden in the others
//   data-vt-go="a"           a click (or Enter on it) shows state a; the innermost wins
//   data-vt-go-hover="a"     state a while the pointer stays where the element was
//   data-vt-submit="#send"   on a field: Enter (not Shift+Enter) presses that button
//   data-vt-cancel           on a dialog's button with data-vt-go: what Escape and a
//                            click on the backdrop do (else .vt-dialog-close, else
//                            a button that reads Cancel or Close)
//   data-vt-go-after="a" data-vt-go-delay="800"
//                            on a direct child of the container: in the states that
//                            child belongs to, state a follows by itself after 800 ms
//
// A menu drawn open in a state (.vt-dropdown-menu.vt-open[data-vt-keep-open] in a
// .vt-dropdown-wrap) closes on Escape, a click elsewhere or Tab out of it, to the
// state its button goes to. A dialog drawn open (.vt-dialog-overlay.vt-open) keeps
// Tab inside it and takes the focus when its state is shown. Closed with Escape (or
// a click elsewhere), the focus goes back to what opened them: each state draws its
// own copy of the region, so the copy is found by what the opener was — its
// data-vt-go, label, place among its like and where it was — else the element
// nearest to that place, never the body.
//
// Each change fires `vt-state-change` on the container (`detail.state`,
// `detail.previous`) and sets `data-vt-state` on it and on <html>, for page CSS. A
// hidden element gets the `hidden` attribute: the page's CSS should make it win
// over a component's own `display` (`[data-vt-show][hidden] { display: none !important; }`).
// A `<select data-vt-states-select>` (options are states) and a
// `<button data-vt-states-theme>` (dark mode) make a switcher for review; with a
// select on the page, `[` and `]` step through the states.
var VtStates = {
  containers: [],

  stateOf: function(container) { return container.getAttribute('data-vt-state'); },

  list: function(container) {
    return String(container.getAttribute('data-vt-states') || '').split(/\s+/).filter(Boolean);
  },

  /** Show a state; `quiet` skips the view transition and keeps a hover in progress. */
  go: function(container, state, quiet, then) {
    if (!state || state === VtStates.stateOf(container) || VtStates.list(container).indexOf(state) < 0) return;
    if (!quiet) container.__vtHover = null;
    var change = function() { VtStates.apply(container, state); if (then) then(); };
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!quiet && !calm && document.startViewTransition) document.startViewTransition(change);
    else change();
  },

  apply: function(container, state) {
    var previous = VtStates.stateOf(container);
    container.querySelectorAll('[data-vt-show]').forEach(function(el) {
      el.toggleAttribute('hidden', el.getAttribute('data-vt-show').split(' ').indexOf(state) < 0);
    });
    container.setAttribute('data-vt-state', state);
    document.documentElement.setAttribute('data-vt-state', state);
    var select = document.querySelector('[data-vt-states-select]');
    if (select && VtStates.containers[0] === container) select.value = state;
    if (container.hasAttribute('data-vt-states-url')) {
      var url = new URL(location.href);
      url.searchParams.set('state', state);
      history.replaceState(history.state, '', url);
    }
    // A state that moves on by itself: said by the container's direct child for it.
    clearTimeout(container.__vtTimer);
    for (var i = 0; i < container.children.length; i++) {
      var child = container.children[i];
      var next = child.getAttribute('data-vt-go-after');
      var own = child.getAttribute('data-vt-show');
      if (!next || (own && own.split(' ').indexOf(state) < 0)) continue;
      container.__vtTimer = setTimeout(function(to) { return function() { VtStates.go(container, to); }; }(next), Number(child.getAttribute('data-vt-go-delay')) || 0);
      break;
    }
    container.dispatchEvent(new CustomEvent('vt-state-change', { bubbles: true, detail: { state: state, previous: previous } }));
  },

  shown: function(el) { return !!(el && el.getClientRects().length && !el.closest('[hidden]')); },

  /** The menu drawn open and the dialog drawn open that this state shows, if any. */
  openMenu: function(container) {
    return Array.prototype.filter.call(container.querySelectorAll('.vt-dropdown-menu.vt-open[data-vt-keep-open]'), VtStates.shown)[0] || null;
  },
  openDialog: function(container) {
    return Array.prototype.filter.call(container.querySelectorAll('.vt-dialog-overlay.vt-open, [role="dialog"].vt-open'), VtStates.shown)[0] || null;
  },

  labelOf: function(el) {
    return String(el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
  },

  /** The element a click or a key on `el` puts the focus back on: `el`, else the field or button inside it. */
  focusTarget: function(el) {
    if (!el) return null;
    if (el.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) return el;
    return VtStates.focusable(el)[0] || null;
  },

  /**
   * Remember what left the current state: its data-vt-go, its label, its place
   * among the shown elements like it and where it was on the screen. Each state
   * draws its own copy of the region, so after coming back the element is
   * another node; this is how its copy is found (see `refocus`).
   */
  remember: function(container, el) {
    var target = VtStates.focusTarget(el) || el;
    if (!target || !target.getBoundingClientRect) return;
    var go = el.getAttribute('data-vt-go') || '';
    var label = VtStates.labelOf(target);
    var like = VtStates.likeOf(container, go, label);
    var r = target.getBoundingClientRect();
    var trail = container.__vtTrail || (container.__vtTrail = []);
    trail.push({ from: VtStates.stateOf(container), go: go, label: label, index: Math.max(0, like.indexOf(target)), x: r.left + r.width / 2, y: r.top + r.height / 2 });
    if (trail.length > 20) trail.shift();
  },

  /** The shown, focusable elements that go to `go` (any, when empty) and read `label`. */
  likeOf: function(container, go, label) {
    return VtStates.focusable(container).filter(function(n) {
      var holder = n.closest('[data-vt-go]');
      return (!go || (holder && container.contains(holder) && holder.getAttribute('data-vt-go') === go)) && VtStates.labelOf(n) === label;
    });
  },

  nearest: function(list, x, y) {
    var best = null;
    var far = Infinity;
    list.forEach(function(n) {
      var r = n.getBoundingClientRect();
      var d = Math.pow(r.left + r.width / 2 - x, 2) + Math.pow(r.top + r.height / 2 - y, 2);
      if (d < far) { far = d; best = n; }
    });
    return best;
  },

  /**
   * Back in a state: the focus goes to the copy of what left it last — the same
   * data-vt-go and label at the same place among its like, else the same label
   * nearest to where it was, else the focusable element nearest to that place.
   * With nothing remembered (the state was shown from script or the URL): the
   * element that goes to `left` (the state just closed) nearest to `anchor` (the
   * closed menu's button), else the focusable element nearest to `anchor`, else
   * the first focusable one in the container. Never to the body.
   */
  refocus: function(container, left, anchor) {
    var state = VtStates.stateOf(container);
    var trail = container.__vtTrail || [];
    var mark = null;
    for (var i = trail.length - 1; i >= 0; i--) {
      if (trail[i].from === state) { mark = trail[i]; trail.length = i; break; }
    }
    var all = VtStates.focusable(container);
    var pick = null;
    if (mark) {
      var same = VtStates.likeOf(container, mark.go, mark.label);
      pick = same[mark.index] || VtStates.nearest(same, mark.x, mark.y)
        || VtStates.nearest(VtStates.likeOf(container, '', mark.label), mark.x, mark.y)
        || VtStates.nearest(all, mark.x, mark.y);
    }
    if (!pick && left) {
      var back = Array.prototype.map.call(container.querySelectorAll('[data-vt-go="' + left + '"]'), VtStates.focusTarget).filter(function(n) { return n && VtStates.shown(n); });
      pick = anchor ? VtStates.nearest(back, anchor.x, anchor.y) : back[0];
    }
    if (!pick && anchor) pick = VtStates.nearest(all, anchor.x, anchor.y);
    pick = pick || all[0];
    if (pick) pick.focus();
  },

  /** Go where `el` goes; then the focus goes to what led here (see `refocus`). `from` is where the focus came from. */
  follow: function(container, el, from) {
    if (!el) return false;
    var left = VtStates.stateOf(container);
    var r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : null;
    var anchor = r && r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
    VtStates.go(container, el.getAttribute('data-vt-go'), false, function() { VtStates.refocus(container, left, anchor); });
    return true;
  },

  /** A menu drawn open closes the way its button does: the button's state. */
  closeMenu: function(container, menu) {
    var wrap = menu.closest('.vt-dropdown-wrap');
    var button = null;
    if (wrap) for (var i = 0; i < wrap.children.length && !button; i++) {
      var child = wrap.children[i];
      if (child === menu) continue;
      button = child.matches('[data-vt-go]') ? child : child.querySelector('[data-vt-go]');
    }
    return VtStates.follow(container, button, button);
  },

  /**
   * A dialog drawn open is cancelled the way its Cancel does: a [data-vt-cancel]
   * with data-vt-go, else its close button (.vt-dialog-close), else a button
   * that reads Cancel or Close, else the first one that goes anywhere.
   */
  cancelDialog: function(container, dialog) {
    var goes = Array.prototype.filter.call(dialog.querySelectorAll('[data-vt-go]'), VtStates.shown);
    var pick = goes.filter(function(b) { return b.hasAttribute('data-vt-cancel'); })[0]
      || goes.filter(function(b) { return b.classList.contains('vt-dialog-close'); })[0]
      || goes.filter(function(b) { return /^(cancel|close|not now|dismiss)$/i.test(String(b.textContent || b.getAttribute('aria-label') || '').trim()); })[0]
      || goes[0];
    return VtStates.follow(container, pick);
  },

  focusable: function(root) {
    return Array.prototype.filter.call(root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'), function(n) {
      return !n.disabled && n.getAttribute('aria-hidden') !== 'true' && VtStates.shown(n);
    });
  },

  containerOf: function(el) {
    var container = el && el.closest ? el.closest('[data-vt-states]') : null;
    return container && container.__vtStates ? container : null;
  },

  init: function() {
    document.querySelectorAll('[data-vt-states]').forEach(function(container) {
      if (container.__vtStates) return;
      container.__vtStates = true;
      VtStates.containers.push(container);
      // An element that is not a link, a button or a field is reachable from the keyboard too.
      // One that already has a role keeps it: a menu row stays role="menuitem" (its menu
      // handles the keys and the focus), it does not become a button.
      container.querySelectorAll('[data-vt-go]').forEach(function(el) {
        if (/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.hasAttribute('role') || el.querySelector('[data-vt-go], input, textarea')) return;
        el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      });
      var states = VtStates.list(container);
      var wanted = container.hasAttribute('data-vt-states-url') ? new URLSearchParams(location.search).get('state') : null;
      if (states.length) VtStates.apply(container, states.indexOf(wanted) >= 0 ? wanted : states[0]);
    });
    veritheme.showState = function(state) {
      VtStates.containers.forEach(function(container) { VtStates.go(container, state); });
    };
    if (VtStates.bound) return;
    VtStates.bound = true;

    document.addEventListener('click', function(e) {
      var container = VtStates.containerOf(e.target);
      if (!container) return;
      if (e.target.closest('a[href="#"]')) e.preventDefault();
      var el = e.target.closest('[data-vt-go]');
      if (!el || !container.contains(el)) {
        // A click elsewhere: a menu drawn open closes to its button's state; a
        // click on a dialog's backdrop (not inside the dialog) cancels it.
        var menu = VtStates.openMenu(container);
        if (menu && !menu.closest('.vt-dropdown-wrap').contains(e.target)) { VtStates.closeMenu(container, menu); return; }
        var dialog = VtStates.openDialog(container);
        if (dialog && e.target === dialog) VtStates.cancelDialog(container, dialog);
        return;
      }
      var field = Boolean(e.target.closest('input, textarea'));
      var to = el.getAttribute('data-vt-go');
      if (to !== VtStates.stateOf(container) && VtStates.list(container).indexOf(to) >= 0) VtStates.remember(container, el);
      VtStates.go(container, to, false, field && function() {
        // The same field in the next state: keep typing where the click was.
        var next = Array.prototype.filter.call(container.querySelectorAll('input[type="text"], input:not([type]), textarea'), function(f) { return f.offsetParent !== null; })[0];
        if (next) { next.focus(); try { next.setSelectionRange(next.value.length, next.value.length); } catch (error) { /* not a text field */ } }
      });
    });

    document.addEventListener('keydown', function(e) {
      var here = VtStates.containerOf(e.target) || VtStates.containers.filter(function(c) { return VtStates.openMenu(c) || VtStates.openDialog(c); })[0];
      if (here) {
        var openMenu = VtStates.openMenu(here);
        var openDialog = VtStates.openDialog(here);
        // Escape closes a menu drawn open (to its button's state), else cancels a dialog drawn open.
        if (e.key === 'Escape' && (openMenu || openDialog)) {
          e.preventDefault();
          if (openMenu) VtStates.closeMenu(here, openMenu); else VtStates.cancelDialog(here, openDialog);
          return;
        }
        // Tab out of a menu drawn open closes it, as with a menu opened by a click.
        if (e.key === 'Tab' && openMenu && openMenu.contains(e.target)) { VtStates.closeMenu(here, openMenu); return; }
        // Tab stays inside a dialog drawn open.
        if (e.key === 'Tab' && openDialog) {
          var all = VtStates.focusable(openDialog);
          if (all.length) {
            var head = all[0];
            var last = all[all.length - 1];
            if (!openDialog.contains(e.target)) { e.preventDefault(); head.focus(); return; }
            if (e.shiftKey && e.target === head) { e.preventDefault(); last.focus(); return; }
            if (!e.shiftKey && e.target === last) { e.preventDefault(); head.focus(); return; }
          }
        }
        // Enter in a field that says where it submits (data-vt-submit="<selector or id>"):
        // that button is pressed. Shift+Enter in a text area is a new line.
        var field = e.target.closest && e.target.closest('[data-vt-submit]');
        if (e.key === 'Enter' && field && !e.shiftKey && !e.isComposing) {
          var to = field.getAttribute('data-vt-submit');
          var target = null;
          try { target = Array.prototype.filter.call(here.querySelectorAll(to), VtStates.shown)[0] || null; } catch (error) { target = null; }
          target = target || document.getElementById(to);
          if (target) { e.preventDefault(); target.click(); return; }
        }
      }
      var el = e.target.closest && e.target.closest('[data-vt-go][role="button"]');
      var container = VtStates.containerOf(el);
      if (container && e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); VtStates.remember(container, el); VtStates.go(container, el.getAttribute('data-vt-go')); return; }
      var select = document.querySelector('[data-vt-states-select]');
      var first = VtStates.containers[0];
      if (!select || !first || e.target !== document.body || (e.key !== '[' && e.key !== ']')) return;
      var states = VtStates.list(first);
      var next = states.indexOf(VtStates.stateOf(first)) + (e.key === ']' ? 1 : -1);
      if (next >= 0 && next < states.length) VtStates.go(first, states[next]);
    });

    // A state the user went to that shows a dialog drawn open: the focus goes into it.
    document.addEventListener('vt-state-change', function(e) {
      if (!e.detail || !e.detail.previous) return;
      var container = e.target;
      requestAnimationFrame(function() {
        var dialog = VtStates.openDialog(container);
        if (!dialog || dialog.contains(document.activeElement)) return;
        var first = VtStates.focusable(dialog)[0];
        if (first) first.focus();
      });
    });

    // While hovering: the state is shown as long as the pointer stays where the
    // element was. (The element itself is replaced by its copy in the other state.)
    document.addEventListener('pointerover', function(e) {
      var el = e.target.closest && e.target.closest('[data-vt-go-hover]');
      var container = VtStates.containerOf(el);
      if (!container || container.__vtHover) return;
      container.__vtHover = { back: VtStates.stateOf(container), rect: el.getBoundingClientRect() };
      VtStates.go(container, el.getAttribute('data-vt-go-hover'), true);
    });
    document.addEventListener('pointermove', function(e) {
      VtStates.containers.forEach(function(container) {
        var hover = container.__vtHover;
        if (!hover) return;
        var r = hover.rect;
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
        container.__vtHover = null;
        VtStates.go(container, hover.back, true);
      });
    });

    // The review switcher, when the page has one.
    document.addEventListener('change', function(e) {
      if (!e.target.matches || !e.target.matches('[data-vt-states-select]') || !VtStates.containers[0]) return;
      VtStates.go(VtStates.containers[0], e.target.value);
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest || !e.target.closest('[data-vt-states-theme]')) return;
      var dark = document.documentElement.classList.toggle('dark');
      try { localStorage.theme = dark ? 'dark' : 'light'; } catch (error) { /* storage blocked */ }
    });
  }
};

// Auto-initialize all components
(function() {
  function initAll() {
    VtAccordion.init();
    VtCalendar.init();
    VtChip.init();
    VtRadioGroup.init();
    VtTabs.init();
    VtCollapsible.init();
    VtCombobox.init();
    VtResizable.init();
    VtCarousel.init();
    VtDropdown.init();
    VtScrollView.init();
    VtNumberInput.init();
    VtPopover.init();
    VtSelect.init();
    VtSlider.init();
    VtToast.init();
    VtProgress.init();
    VtSwitch.init();
    VtDismiss.init();
    VtRating.init();
    VtFileUpload.init();
    VtDialog.init();
    VtTreeView.init();
    VtFields.init();
    VtCommand.init();
    VtSidebarNav.init();
    VtStates.init();
  }

  // Markup added after load — a rendered preview, a fetched fragment, a
  // client-side route — has to be wired the same way. Every component's init
  // is written to be re-run safely (per-element guards, document listeners
  // bound once per window), so calling this again is cheap and idempotent.
  window.veritheme = window.veritheme || {};
  window.veritheme.init = initAll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // The bundle may be evaluated more than once in one window (a client-side
  // router re-running the script, two script tags). The swap listener is
  // bound only by the first run and always calls the latest init, so every
  // navigation wires the new page exactly once.
  if (!window.veritheme.__swapBound) {
    window.veritheme.__swapBound = true;
    document.addEventListener('astro:after-swap', function() {
      window.veritheme.init();
    });
  }
})();

})();
