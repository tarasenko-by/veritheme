/*!
 * veritheme.js v1.2.2
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
    menu.classList.remove('vt-open');
    VtDropdown.triggersFor(menu).forEach(function(trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    });
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
    menu.classList.add('vt-open');
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
    menu.setAttribute('role', 'menu');

    menu.querySelectorAll('.vt-command-item,.vt-dropdown-item').forEach(function(item) {
      item.tabIndex = -1;
      var checkbox = item.querySelector(CHECKBOX_INDICATOR);
      var radio = item.querySelector(RADIO_INDICATOR);
      var mark = item.querySelector('.vt-command-item-check');
      item.setAttribute('role', checkbox || mark ? 'menuitemcheckbox' : radio ? 'menuitemradio' : 'menuitem');
      if (checkbox) item.setAttribute('aria-checked', String(indicatorOn(checkbox)));
      if (radio) item.setAttribute('aria-checked', String(indicatorOn(radio)));
      // A check mark row says its state itself (aria-checked in the markup).
      if (mark && !item.hasAttribute('aria-checked')) item.setAttribute('aria-checked', 'false');
    });

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.classList.contains('vt-open')) VtDropdown.close(menu, true);
      else VtDropdown.open(trigger);
    });

    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        VtDropdown.open(trigger, e.key === 'ArrowUp');
      }
    });

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

    // Plain items close the menu on activation; checkbox and radio items stay open.
    menu.addEventListener('click', function(e) {
      var item = e.target.closest('[role="menuitem"]');
      if (item && item.getAttribute('aria-disabled') !== 'true') VtDropdown.close(menu, true);
    });
  },

  init: function() {
    document.querySelectorAll('[data-vt-dropdown-trigger]').forEach(VtDropdown.bindTrigger);

    if (window.__vtDropdownEvents) return;
    window.__vtDropdownEvents = true;

    document.addEventListener('click', function(e) {
      if (!e.target.closest('[data-vt-dropdown-trigger],.vt-dropdown-menu')) VtDropdown.closeAll(false);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') VtDropdown.closeAll(true);
    });
  }
};

var CHECK_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// Checkable rows carry the system's own atoms: .vt-checkbox (.checked) and
// .vt-radio (.selected, with a .vt-dot). The older markup drew them with
// utilities (.checkbox-indicator / .radio-indicator) and still works.
var CHECKBOX_INDICATOR = '.vt-checkbox, .checkbox-indicator';
var RADIO_INDICATOR = '.vt-radio, .radio-indicator';

function indicatorOn(indicator) {
  if (indicator.classList.contains('vt-checkbox')) return indicator.classList.contains('checked');
  if (indicator.classList.contains('vt-radio')) return indicator.classList.contains('selected');
  if (indicator.classList.contains('checkbox-indicator')) return indicator.classList.contains('vt-bg-brand-fill');
  return !!indicator.children.length;
}

// Checkbox menu item: the visual indicator and aria-checked always agree.
function toggleCheckbox(item) {
  if (item.getAttribute('aria-disabled') === 'true') return;
  var indicator = item.querySelector(CHECKBOX_INDICATOR);
  var mark = item.querySelector('.vt-command-item-check');
  if (!indicator && !mark) return;

  var wasChecked = item.getAttribute('aria-checked') === 'true';
  if (indicator && indicator.classList.contains('vt-checkbox')) {
    indicator.classList.toggle('checked', !wasChecked);
    if (!indicator.querySelector('.check-icon')) indicator.insertAdjacentHTML('beforeend', CHECK_ICON.replace('<svg ', '<svg class="check-icon" '));
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

    // Scroll indicators — vertical
    document.querySelectorAll('.vt-scroll-indicator').forEach(function(indicator) {
      if (indicator.hasAttribute('data-vt-indicator-init')) return;
      indicator.setAttribute('data-vt-indicator-init', 'true');

      var scroll = indicator.querySelector('.vt-scroll, .vt-scroll-hidden, .vt-scroll-autohide');
      if (!scroll) return;

      scroll.addEventListener('scroll', function() {
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

      scroll.addEventListener('scroll', function() {
        var sl = scroll.scrollLeft;
        var sw = scroll.scrollWidth;
        var cw = scroll.clientWidth;
        indicator.classList.toggle('vt-show-left', sl > 8);
        indicator.classList.toggle('vt-show-right', sl < sw - cw - 8);
      });
    });
  }
};

// VtNumberInput — increment/decrement with min/max constraints
var VtNumberInput = {
  init: function() {
    document.querySelectorAll('[data-vt-number-input]').forEach(function(wrapper) {
      if (wrapper.hasAttribute('data-vt-ni-bound')) return;
      wrapper.setAttribute('data-vt-ni-bound', 'true');

      var input = wrapper.querySelector('[data-vt-number-value]');
      var decBtn = wrapper.querySelector('[data-vt-action="decrement"]');
      var incBtn = wrapper.querySelector('[data-vt-action="increment"]');
      if (!input) return;

      function toInt(value, fallback) {
        // `parseInt(x) || fallback` treats a legitimate 0 as missing.
        var n = parseInt(value, 10);
        return isNaN(n) ? fallback : n;
      }

      function bounds() {
        return {
          min: input.hasAttribute('min') ? toInt(input.min, -Infinity) : -Infinity,
          max: input.hasAttribute('max') ? toInt(input.max, Infinity) : Infinity
        };
      }

      function updateButtons() {
        var val = toInt(input.value, 0);
        var b = bounds();
        if (decBtn) decBtn.disabled = val <= b.min;
        if (incBtn) incBtn.disabled = val >= b.max;
      }

      function step(delta) {
        var val = toInt(input.value, 0);
        var b = bounds();
        var next = Math.min(Math.max(val + delta, b.min), b.max);
        input.value = next;
        updateButtons();
      }

      if (decBtn) decBtn.addEventListener('click', function() { step(-1); });
      if (incBtn) incBtn.addEventListener('click', function() { step(1); });

      input.addEventListener('change', function() {
        var b = bounds();
        // An empty/invalid field falls back to the lower bound when there is
        // one, otherwise to 0 — never to -Infinity.
        var val = toInt(input.value, isFinite(b.min) ? b.min : 0);
        input.value = Math.min(Math.max(val, b.min), b.max);
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
var VtToast = {
  _count: 0,

  show: function(type) {
    var container = document.getElementById('toast-container');
    if (!container) {
      // Out-of-the-box: create the host container on first use.
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'vt-fixed vt-bottom-4 vt-right-4 vt-z-50 vt-flex vt-flex-col vt-items-end';
      document.body.appendChild(container);
    }

    var id = 'toast-' + (++VtToast._count);
    var configs = {
      default: { title: 'Scheduled: Catch up', desc: 'Friday, February 14, 2026 at 5:57 PM', icon: '', btn: 'Undo' },
      success: { title: 'Success', desc: 'Your changes have been saved.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-toast-icon" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>', btn: '' },
      error: { title: 'Error', desc: 'Something went wrong. Please try again.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-toast-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', btn: 'Retry' },
      action: { title: 'Event created', desc: 'Sunday, December 03, 2023', icon: '', btn: 'Undo' }
    };

    var c = configs[type] || configs.default;
    var toast = document.createElement('div');
    toast.id = id;
    // The toast's own classes (components/toast.json): the look lives in the CSS.
    toast.className = 'vt-toast vt-mb-2' + (type === 'success' ? ' vt-toast-success' : type === 'error' ? ' vt-toast-danger' : '');
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML =
      c.icon +
      '<div class="vt-toast-content">' +
        '<p class="vt-toast-title">' + c.title + '</p>' +
        '<p class="vt-toast-description">' + c.desc + '</p>' +
      '</div>' +
      (c.btn ? '<button onclick="this.parentElement.remove()" class="vt-btn vt-btn-bordered vt-btn-sm">' + c.btn + '</button>' : '') +
      '<button onclick="this.parentElement.remove()" aria-label="Close" class="vt-btn vt-btn-ghost vt-btn-icon vt-btn-sm">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '</button>';

    container.appendChild(toast);
    setTimeout(function() {
      var el = document.getElementById(id);
      if (el) el.remove();
    }, 4000);
  },

  init: function() {
    // Expose showToast globally for onclick use
    veritheme.showToast = function(type) { VtToast.show(type); };
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
    VtDialog.init();
    VtTreeView.init();
    VtFields.init();
    VtCommand.init();
    VtSidebarNav.init();
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
