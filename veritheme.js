/*!
 * veritheme.js v1.1.1
 * https://veritheme.com
 * MIT License
 */

// UCAccordion — expand/collapse with single and multi mode
var UCAccordion = {
  init: function() {
    var uid = 0;
    document.querySelectorAll('[data-accordion-item]').forEach(function(item) {
      uid++;
      var trigger = item.querySelector('[data-accordion-trigger]');
      var content = item.querySelector('[data-accordion-content]');
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
      content.style.maxHeight = prevMaxHeight || '0px';
      void content.offsetHeight; // commit the collapsed start value
      content.style.transition = prevTransition;
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

    document.querySelectorAll('[data-accordion-content]').forEach(function(content) {
      if (!content.classList.contains('vt-hidden') && !content.classList.contains('hidden')) {
        openContent(content);
      }
    });

    document.querySelectorAll('[data-accordion-trigger]').forEach(function(trigger) {
      if (trigger.hasAttribute('data-accordion-init')) return;
      trigger.setAttribute('data-accordion-init', 'true');

      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
      });
      trigger.addEventListener('click', function() {
        var item = trigger.closest('[data-accordion-item]');
        var accordion = trigger.closest('[data-accordion]');
        var mode = accordion.getAttribute('data-accordion');
        var content = item.querySelector('[data-accordion-content]');
        var icon = trigger.querySelector('[data-accordion-icon]');
        var isOpen = !content.classList.contains('vt-hidden') && !content.classList.contains('hidden') && content.classList.contains('open');

        if (mode === 'single') {
          accordion.querySelectorAll('[data-accordion-item]').forEach(function(otherItem) {
            var otherContent = otherItem.querySelector('[data-accordion-content]');
            var otherTrigger = otherItem.querySelector('[data-accordion-trigger]');
            var otherIcon = otherItem.querySelector('[data-accordion-trigger] [data-accordion-icon]');
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
          content.offsetHeight;
          openContent(content);
          if (icon) icon.classList.add('vt-rotate-180');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
};

// UCCalendar — month navigation, single/range selection and roving keyboard
// focus for `[data-calendar]` cards. Selection is tracked by date, not by grid
// position, so it survives navigating between months.
var UCCalendar = {
  init: function() {
    document.querySelectorAll('[data-calendar]').forEach(function(cal) {
      if (cal.dataset.calendarBound) return;
      cal.dataset.calendarBound = 'true';

      var grid = cal.querySelector('[data-calendar-grid]') || cal;
      var heading = cal.querySelector('[data-calendar-heading]');
      var monthKey = cal.dataset.calendarMonth || new Date().toISOString().slice(0, 7);
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
          if (!day.dataset.date) {
            day.dataset.date = stamp(new Date(view.getFullYear(), view.getMonth(), Number(day.textContent)));
          }
          day.disabled = day.disabled || day.classList.contains('vt-muted') || day.classList.contains('vt-outside');
          day.setAttribute('aria-label', readable(day.dataset.date));
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

      function paint() {
        days().forEach(function(day) {
          var value = day.dataset.date;
          var selected = value === start || value === end;
          day.classList.toggle('vt-active', selected);
          day.classList.toggle('vt-range-middle', !!(start && end && value > start && value < end));
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

      var active = days().filter(function(day) { return day.classList.contains('vt-active'); });
      if (active[0]) start = active[0].dataset.date;
      if (active.length > 1) end = active[active.length - 1].dataset.date;

      function render() {
        if (heading) {
          heading.textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        cal.dataset.calendarMonth = monthOf(view);

        if (monthOf(view) === authoredMonth) {
          grid.innerHTML = authoredGrid;
        } else {
          grid.replaceChildren();
          for (var pad = 0; pad < view.getDay(); pad++) grid.append(document.createElement('span'));
          var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
          for (var n = 1; n <= count; n++) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'vt-calendar-day';
            button.textContent = String(n);
            button.dataset.date = stamp(new Date(view.getFullYear(), view.getMonth(), n));
            grid.append(button);
          }
        }
        prepare();
        paint();
      }

      cal.addEventListener('click', function(e) {
        var nav = e.target.closest('[data-calendar-nav]');
        if (nav) {
          view.setMonth(view.getMonth() + Number(nav.dataset.calendarNav));
          render();
          return;
        }

        var day = e.target.closest('.vt-calendar-day');
        if (!day || day.disabled) return;
        var value = day.dataset.date;

        if (cal.dataset.calendar === 'range') {
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

        var date = new Date(day.dataset.date + 'T12:00:00');
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
          return candidate.dataset.date === stamp(date) && !candidate.disabled;
        });
        if (next) {
          ensureTabbable(next);
          next.focus();
        }
      });
    });
  }
};

// UCChip — toggleable filter chips inside [data-chip-group]
var UCChip = {
  init: function() {
    document.querySelectorAll('[data-chip-group]').forEach(function(group) {
      if (group.hasAttribute('data-chip-bound')) return;
      group.setAttribute('data-chip-bound', 'true');
      group.querySelectorAll('.vt-chip-btn').forEach(function(btn) {
        var selected = btn.getAttribute('data-selected') === 'true' || btn.classList.contains('vt-chip-active');
        btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
        btn.addEventListener('click', function() {
          var isSelected = btn.getAttribute('data-selected') === 'true';
          btn.setAttribute('data-selected', isSelected ? 'false' : 'true');
          btn.setAttribute('aria-pressed', isSelected ? 'false' : 'true');
          btn.classList.toggle('vt-chip-active', !isSelected);
        });
      });
    });
  }
};

// UCRadioGroup — custom radio circles grouped by [data-group]
var UCRadioGroup = {
  init: function() {
    document.querySelectorAll('[data-group] .vt-radio').forEach(function(radio) {
      var label = radio.closest('label');
      if (!label || label.hasAttribute('data-radio-bound')) return;
      label.setAttribute('data-radio-bound', 'true');
      label.addEventListener('click', function() {
        if (radio.classList.contains('disabled')) return;
        var group = radio.closest('[data-group]');
        group.querySelectorAll('.vt-radio').forEach(function(r) {
          r.classList.remove('selected');
        });
        radio.classList.add('selected');
      });
    });
  }
};

// selectRadio — called via onclick in HTML (docs markup)
function selectRadio(group, el) {
  document.querySelectorAll('[data-group="' + group + '"] .vt-radio').forEach(function(r) {
    r.classList.remove('selected');
  });
  var radio = el.querySelector('.vt-radio');
  if (radio && !radio.classList.contains('disabled')) radio.classList.add('selected');
}

// Inline `onclick` looks these up on window. In the shipped bundle the files
// are concatenated at top level, where a function declaration is already
// global; under a bundler it would be module-scoped, so pin them explicitly.
if (typeof window !== 'undefined') window.selectRadio = selectRadio;

// UCTabs — tab switching for [data-tab-group] with roving-tabindex keyboard nav
var UCTabs = {
  activate: function(container, tabName) {
    container.querySelectorAll('[role="tab"]').forEach(function(t) {
      if(t.closest('[data-tab-group]')!==container)return;
      var isActive = t.getAttribute('data-tab') === tabName;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      t.classList.toggle('vt-active', isActive);
    });
    container.querySelectorAll('[role="tabpanel"]').forEach(function(p) {
      if(p.closest('[data-tab-group]')!==container)return;
      p.classList.toggle('vt-hidden', p.getAttribute('data-panel') !== tabName);
    });
  },

  init: function() {
    document.querySelectorAll('[data-tab-group]').forEach(function(container) {
      if(container.getAttribute('data-tab-group')==='component-page')return;
      if (container.hasAttribute('data-tabs-bound')) return;
      container.setAttribute('data-tabs-bound', 'true');
      container.querySelectorAll('[role="tab"]').forEach(function(tab) {
        if(tab.closest('[data-tab-group]')!==container)return;
        tab.addEventListener('click', function() {
          UCTabs.activate(container, tab.getAttribute('data-tab'));
        });
      });
    });

    if (!window.__vtTabsKeyboard) {
      window.__vtTabsKeyboard = true;
      document.addEventListener('keydown', function(e) {
        var tab = e.target;
        if (!tab || tab.getAttribute('role') !== 'tab') return;
        if(tab.closest('[data-tab-group]')?.getAttribute('data-tab-group')==='component-page')return;
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

// UCCollapsible — expand/collapse content with optional animation
var UCCollapsible = {
  init: function() {
    // Initialize open collapsibles
    document.querySelectorAll('[data-collapsible][data-collapsible-open]').forEach(function(collapsible) {
      var content = collapsible.querySelector('[data-collapsible-content]');
      var icon = collapsible.querySelector('[data-collapsible-icon]');
      if (content) {
        content.classList.remove('vt-hidden');
        if (collapsible.hasAttribute('data-collapsible-animated')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
      if (icon) {
        icon.classList.add('vt-rotate-180');
      }
    });

    // Bind triggers with guard
    document.querySelectorAll('[data-collapsible-trigger]').forEach(function(trigger) {
      if (trigger.hasAttribute('data-collapsible-bound')) return;
      trigger.setAttribute('data-collapsible-bound', 'true');

      trigger.addEventListener('click', function() {
        var collapsible = trigger.closest('[data-collapsible]');
        var content = collapsible.querySelector(':scope > [data-collapsible-content]');
        if (!content) {
          content = collapsible.querySelector('[data-collapsible-content]');
        }
        var icon = collapsible.querySelector(':scope > * [data-collapsible-icon]') || collapsible.querySelector('[data-collapsible-icon]');
        var isAnimated = collapsible.hasAttribute('data-collapsible-animated');
        var labelCollapse = trigger.querySelector('[data-collapsible-label-collapse]');
        var labelExpand = trigger.querySelector('[data-collapsible-label-expand]');
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
          collapsible.removeAttribute('data-collapsible-open');
        } else {
          if (isAnimated) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.classList.remove('vt-hidden');
          }
          if (icon) icon.classList.add('vt-rotate-180');
          if (labelCollapse) labelCollapse.classList.remove('vt-hidden');
          if (labelExpand) labelExpand.classList.add('vt-hidden');
          collapsible.setAttribute('data-collapsible-open', '');
        }
      });
    });
  }
};

// UCCombobox — searchable single/multi-select with tags
var UCCombobox = {
  init: function() {
    var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-4 vt-h-4 vt-shrink-0 vt-text-brand-fill vt-combobox-icon"><path d="M20 6 9 17l-5-5"/></svg>';
    var emptySpacer = '<span class="vt-w-4 vt-h-4 vt-shrink-0 vt-combobox-icon"></span>';
    var xTagSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-3 vt-h-3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    // Close on click outside
    if (!document.body.hasAttribute('data-combobox-outside-init')) {
      document.body.setAttribute('data-combobox-outside-init', 'true');
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.vt-combobox-wrapper')) {
          document.querySelectorAll('[data-combobox-content]').forEach(function(el) {
            el.classList.remove('vt-open');
          });
        }
      });
    }

    // Expose functions globally for inline onclick use
    window.openCombobox = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('vt-open');
    };

    window.toggleCombobox = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('vt-open');
    };

    window.filterCombobox = function(input, id) {
      var dropdown = document.getElementById(id);
      var query = input.value.toLowerCase();
      var items = dropdown.querySelectorAll('.vt-combobox-item');
      var groups = dropdown.querySelectorAll('[data-combobox-group]');
      var emptyEl = dropdown.querySelector('.vt-combobox-empty');
      var totalVisible = 0;

      if (groups.length > 0) {
        groups.forEach(function(group) {
          var groupItems = group.querySelectorAll('.vt-combobox-item');
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

    function setItemIcon(item, checked) {
      var icon = item.querySelector('.vt-combobox-icon');
      if (icon) icon.outerHTML = checked ? checkSvg : emptySpacer;
    }

    window.selectComboboxItem = function(item) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.vt-combobox-wrapper');
      var keepIcons = wrapper.hasAttribute('data-keep-icons');
      var input = wrapper.querySelector('input');
      var dropdown = item.closest('[data-combobox-content]');

      input.value = text;

      dropdown.querySelectorAll('.vt-combobox-item').forEach(function(i) {
        i.classList.remove('vt-selected');
        if (!keepIcons) setItemIcon(i, false);
      });
      item.classList.add('vt-selected');
      if (!keepIcons) setItemIcon(item, true);

      dropdown.classList.remove('vt-open');
    };

    window.selectComboboxButton = function(item, dropdownId) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.vt-combobox-wrapper');
      var label = wrapper.querySelector('.vt-combobox-button-label');
      var dropdown = document.getElementById(dropdownId);

      label.textContent = text;
      label.classList.remove('vt-text-foreground-disabled', 'vt-text-foreground-muted');

      dropdown.querySelectorAll('.vt-combobox-item').forEach(function(i) {
        i.classList.remove('vt-selected');
        setItemIcon(i, false);
      });
      item.classList.add('vt-selected');
      setItemIcon(item, true);

      dropdown.classList.remove('vt-open');
    };

    window.toggleMultiComboboxItem = function(item) {
      var isSelected = item.classList.toggle('vt-selected');
      setItemIcon(item, isSelected);

      var wrapper = item.closest('.vt-combobox-wrapper');
      var tagContainer = wrapper.querySelector('.vt-combobox-tags');
      var text = item.textContent.trim();

      if (isSelected) {
        var tag = document.createElement('span');
        tag.className = 'vt-combobox-tag vt-inline-flex vt-items-center vt-gap-1 vt-rounded vt-bg-surface-subtle vt-px-2 vt-py-0.5 vt-text-xs vt-font-medium';
        tag.setAttribute('data-tag-value', text);
        tag.appendChild(document.createTextNode(text));
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'vt-ml-0.5 vt-rounded-sm vt-hover:bg-surface-moderate vt-transition-colors';
        removeBtn.innerHTML = xTagSvg;
        removeBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          window.removeComboboxTag(removeBtn);
        });
        tag.appendChild(removeBtn);
        tagContainer.insertBefore(tag, tagContainer.querySelector('input'));
      } else {
        // The label is arbitrary text — a quote in it ('12" screen') makes the
        // selector unparsable, so the tag stayed while the tick came off.
        var existing = null;
        tagContainer.querySelectorAll('[data-tag-value]').forEach(function(t) {
          if (t.getAttribute('data-tag-value') === text) existing = t;
        });
        if (existing) existing.remove();
      }

      UCCombobox._updateMultiPlaceholder(wrapper);
    };

    window.removeComboboxTag = function(btn) {
      var tag = btn.closest('.vt-combobox-tag');
      if (!tag) return;
      var value = tag.getAttribute('data-tag-value');
      var wrapper = tag.closest('.vt-combobox-wrapper');
      tag.remove();

      var dropdown = wrapper.querySelector('[data-combobox-content]');
      if (dropdown) {
        dropdown.querySelectorAll('.vt-combobox-item').forEach(function(item) {
          if (item.textContent.trim() === value) {
            item.classList.remove('vt-selected');
            setItemIcon(item, false);
          }
        });
      }

      UCCombobox._updateMultiPlaceholder(wrapper);
    };
  },

  _updateMultiPlaceholder: function(wrapper) {
    var input = wrapper.querySelector('input');
    var tags = wrapper.querySelectorAll('.vt-combobox-tag');
    if (input) {
      input.placeholder = tags.length > 0 ? '' : 'Add framework...';
    }
  }
};

// UCResizable — drag-to-resize panels horizontally or vertically
var UCResizable = {
  init: function() {
    document.querySelectorAll('[data-resizable]').forEach(function(container) {
      if (container.hasAttribute('data-resizable-init')) return;
      container.setAttribute('data-resizable-init', 'true');

      var direction = container.dataset.resizable;
      var isHorizontal = direction === 'horizontal';
      var minPct = parseFloat(container.dataset.min || '10');
      var maxPct = parseFloat(container.dataset.max || '90');
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
          handle.style.background = 'hsl(var(--brand-fill) / 0.5)';
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

// UCCarousel — slide carousel with dots, prev/next navigation
var UCCarousel = {
  init: function() {
    document.querySelectorAll('[data-carousel]').forEach(function(el) {
      if (el.hasAttribute('data-carousel-init')) return;
      el.setAttribute('data-carousel-init', 'true');

      var carousel = el;
      var track = carousel.querySelector('[data-carousel-track]');
      var prevBtn = carousel.querySelector('[data-carousel-prev]');
      var nextBtn = carousel.querySelector('[data-carousel-next]');
      var dotsContainer = carousel.querySelector('[data-carousel-dots]');
      var total = parseInt(carousel.dataset.total || '0');
      var visible = parseInt(carousel.dataset.visible || '1');
      var maxIndex = total - visible;
      var current = 0;

      function update() {
        if (visible === 1) {
          track.style.transform = 'translateX(-' + (current * 100) + '%)';
        } else {
          var slide = track.children[0];
          var gap = parseFloat(getComputedStyle(track).gap) || 0;
          var offset = current * (slide.offsetWidth + gap);
          track.style.transform = 'translateX(-' + offset + 'px)';
        }

        if (dotsContainer) {
          dotsContainer.querySelectorAll('[data-dot]').forEach(function(dot) {
            var idx = parseInt(dot.dataset.dot || '0');
            dot.className = 'vt-w-2 vt-h-2 vt-rounded-full vt-transition-colors ' + (idx === current ? 'vt-bg-brand-fill' : 'vt-bg-surface-moderate');
          });
        }

        if (prevBtn) prevBtn.style.opacity = current === 0 ? '0.4' : '1';
        if (nextBtn) nextBtn.style.opacity = current >= maxIndex ? '0.4' : '1';
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
        dotsContainer.querySelectorAll('[data-dot]').forEach(function(dot) {
          dot.addEventListener('click', function() {
            current = Math.min(parseInt(dot.dataset.dot || '0'), maxIndex);
            update();
          });
        });
      }

      update();
    });
  }
};

// UCDropdown — shared open/close state and the WAI-ARIA menu keyboard
// contract for `[data-dropdown-trigger]` buttons and their `.vt-dropdown-menu`.
var UCDropdown = {
  items: function(menu) {
    return Array.from(menu.querySelectorAll('.vt-command-item,.vt-dropdown-item')).filter(function(item) {
      return item.getAttribute('aria-disabled') !== 'true' && !item.disabled;
    });
  },

  triggersFor: function(menu) {
    return Array.from(document.querySelectorAll('[data-dropdown-trigger]')).filter(function(trigger) {
      return trigger.getAttribute('data-dropdown-trigger') === menu.id;
    });
  },

  close: function(menu, restoreFocus) {
    menu.classList.remove('vt-open');
    UCDropdown.triggersFor(menu).forEach(function(trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    });
  },

  closeAll: function(restoreFocus, except) {
    document.querySelectorAll('.vt-dropdown-menu.vt-open').forEach(function(menu) {
      // Combobox panels manage their own open state.
      if (menu !== except && !menu.closest('.vt-combobox-wrapper')) UCDropdown.close(menu, restoreFocus);
    });
  },

  open: function(trigger, focusLast) {
    var menu = document.getElementById(trigger.getAttribute('data-dropdown-trigger'));
    if (!menu) return;
    UCDropdown.closeAll(false, menu);
    menu.classList.add('vt-open');
    trigger.setAttribute('aria-expanded', 'true');
    var items = UCDropdown.items(menu);
    var first = focusLast ? items[items.length - 1] : items[0];
    if (first) first.focus();
  },

  bindTrigger: function(trigger) {
    if (trigger.dataset.dropdownBound) return;
    trigger.dataset.dropdownBound = 'true';

    var menu = document.getElementById(trigger.getAttribute('data-dropdown-trigger'));
    if (!menu) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-controls', menu.id);
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('role', 'menu');

    menu.querySelectorAll('.vt-command-item,.vt-dropdown-item').forEach(function(item) {
      item.tabIndex = -1;
      var checkbox = item.querySelector('.checkbox-indicator');
      var radio = item.querySelector('.radio-indicator');
      item.setAttribute('role', checkbox ? 'menuitemcheckbox' : radio ? 'menuitemradio' : 'menuitem');
      if (checkbox) item.setAttribute('aria-checked', String(checkbox.classList.contains('vt-bg-brand-fill')));
      if (radio) item.setAttribute('aria-checked', String(!!radio.children.length));
    });

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.classList.contains('vt-open')) UCDropdown.close(menu, true);
      else UCDropdown.open(trigger);
    });

    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        UCDropdown.open(trigger, e.key === 'ArrowUp');
      }
    });

    menu.addEventListener('keydown', function(e) {
      var items = UCDropdown.items(menu);
      var index = items.indexOf(document.activeElement);
      var next;

      if (e.key === 'Escape') {
        e.preventDefault();
        UCDropdown.close(menu, true);
        return;
      }
      if (e.key === 'Tab') {
        UCDropdown.close(menu, false);
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
      if (item && item.getAttribute('aria-disabled') !== 'true') UCDropdown.close(menu, true);
    });
  },

  init: function() {
    document.querySelectorAll('[data-dropdown-trigger]').forEach(UCDropdown.bindTrigger);

    if (window.__vtDropdownEvents) return;
    window.__vtDropdownEvents = true;

    document.addEventListener('click', function(e) {
      if (!e.target.closest('[data-dropdown-trigger],.vt-dropdown-menu')) UCDropdown.closeAll(false);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') UCDropdown.closeAll(true);
    });
  }
};

var CHECK_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// Checkbox menu item: the visual indicator and aria-checked always agree.
function toggleCheckbox(item) {
  if (item.getAttribute('aria-disabled') === 'true') return;
  var indicator = item.querySelector('.checkbox-indicator');
  if (!indicator) return;

  var wasChecked = item.getAttribute('aria-checked') === 'true';
  indicator.classList.remove('vt-bg-info-fill');
  ['vt-bg-brand-fill', 'vt-text-generic-white', 'vt-border-transparent'].forEach(function(cls) {
    indicator.classList.toggle(cls, !wasChecked);
  });
  indicator.innerHTML = wasChecked ? '' : CHECK_ICON;
  item.setAttribute('aria-checked', String(!wasChecked));
}

// Radio menu item: one selected indicator per menu.
function selectMenuRadio(item) {
  if (item.getAttribute('aria-disabled') === 'true') return;
  item.closest('.vt-dropdown-menu').querySelectorAll('.radio-indicator').forEach(function(indicator) {
    var selected = indicator.parentElement === item;
    indicator.classList.remove('vt-border-info-fill', 'vt-border-input');
    indicator.classList.toggle('vt-border-brand-fill', selected);
    indicator.classList.toggle('vt-border-border-strong', !selected);
    indicator.parentElement.setAttribute('aria-checked', String(selected));
    indicator.innerHTML = selected ? '<span class="vt-w-2 vt-h-2 vt-rounded-full vt-bg-brand-fill"></span>' : '';
  });
}

if (typeof window !== 'undefined') {
  window.toggleCheckbox = toggleCheckbox;
  window.selectMenuRadio = selectMenuRadio;
}

// UCScrollView — drag-to-scroll and scroll indicators
var UCScrollView = {
  init: function() {
    // Drag-to-scroll for horizontal containers
    document.querySelectorAll('.vt-drag-scroll').forEach(function(el) {
      if (el.hasAttribute('data-drag-init')) return;
      el.setAttribute('data-drag-init', 'true');

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
      if (indicator.hasAttribute('data-indicator-init')) return;
      indicator.setAttribute('data-indicator-init', 'true');

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
      if (indicator.hasAttribute('data-indicator-h-init')) return;
      indicator.setAttribute('data-indicator-h-init', 'true');

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

// UCNumberInput — increment/decrement with min/max constraints
var UCNumberInput = {
  init: function() {
    document.querySelectorAll('[data-number-input]').forEach(function(wrapper) {
      if (wrapper.hasAttribute('data-ni-bound')) return;
      wrapper.setAttribute('data-ni-bound', 'true');

      var input = wrapper.querySelector('[data-number-value]');
      var decBtn = wrapper.querySelector('[data-action="decrement"]');
      var incBtn = wrapper.querySelector('[data-action="increment"]');
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

// UCPopover — toggle popover panels with outside-click close
var UCPopover = {
  init: function() {
    document.querySelectorAll('[data-popover-trigger]').forEach(function(btn) {
      var id = btn.getAttribute('data-popover-trigger');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      if (id) btn.setAttribute('aria-controls', id);

      btn.onclick = function(e) {
        e.stopPropagation();
        var el = id ? document.getElementById(id) : null;
        if (!el) return;

        var isOpen = el.classList.contains('vt-open');

        document.querySelectorAll('.vt-popover-content').forEach(function(p) {
          p.classList.remove('vt-open');
        });
        document.querySelectorAll('[data-popover-trigger]').forEach(function(t) {
          t.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          el.classList.add('vt-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      };
    });

    if (!document.body.hasAttribute('data-popover-outside-init')) {
      document.body.setAttribute('data-popover-outside-init', 'true');
      document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.closest('.vt-popover-content') && !target.closest('[data-popover-trigger]')) {
          document.querySelectorAll('.vt-popover-content').forEach(function(p) {
            p.classList.remove('vt-open');
          });
          document.querySelectorAll('[data-popover-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.vt-popover-content').forEach(function(p) {
            p.classList.remove('vt-open');
          });
          document.querySelectorAll('[data-popover-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }
  }
};

// UCSelect — custom select dropdown with single selection
var UCSelect = {
  init: function() {
    if (document.body.hasAttribute('data-select-init')) return;
    document.body.setAttribute('data-select-init', 'true');

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.vt-select-wrapper')) {
        document.querySelectorAll('.vt-select-dropdown').forEach(function(d) {
          d.classList.remove('open');
        });
      }
    });
  }
};

// toggleSelect — called via onclick in HTML
function toggleSelect(id) {
  var dropdown = document.getElementById(id);
  document.querySelectorAll('.vt-select-dropdown').forEach(function(d) {
    if (d.id !== id) d.classList.remove('open');
  });
  dropdown.classList.toggle('open');
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
  dropdown.classList.remove('open');
}

// Inline `onclick` looks these up on window. In the shipped bundle the files
// are concatenated at top level, where a function declaration is already
// global; under a bundler it would be module-scoped, so pin them explicitly —
// the same thing dialog.js, combobox.js and toast.js do.
if (typeof window !== 'undefined') window.toggleSelect = toggleSelect;
if (typeof window !== 'undefined') window.selectItem = selectItem;

// UCSlider — paints the filled track portion based on value/min/max
var UCSlider = {
  init: function() {
    document.querySelectorAll('input[type="range"]').forEach(function(input) {
      if (input.hasAttribute('data-slider-init')) return;
      input.setAttribute('data-slider-init', 'true');

      function update() {
        var min = parseFloat(input.min || '0');
        var max = parseFloat(input.max || '100');
        var val = parseFloat(input.value || '0');
        var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
        input.style.setProperty('--slider-progress', pct + '%');
      }

      update();
      input.addEventListener('input', update);
    });
  }
};

// UCToast — programmatic toast notifications
var UCToast = {
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

    var id = 'toast-' + (++UCToast._count);
    var configs = {
      default: { title: 'Scheduled: Catch up', desc: 'Friday, February 14, 2026 at 5:57 PM', icon: '', btn: 'Undo' },
      success: { title: 'Success', desc: 'Your changes have been saved.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-5 vt-h-5 vt-text-brand-fill"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>', btn: '' },
      error: { title: 'Error', desc: 'Something went wrong. Please try again.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-5 vt-h-5 vt-text-error-fill"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', btn: 'Retry' },
      action: { title: 'Event created', desc: 'Sunday, December 03, 2023', icon: '', btn: 'Undo' }
    };

    var c = configs[type] || configs.default;
    var toast = document.createElement('div');
    toast.id = id;
    toast.className = 'vt-flex vt-items-start vt-gap-3 vt-w-80 vt-p-4 vt-rounded-lg vt-border vt-border-border-default vt-bg-surface-card vt-shadow-lg vt-mb-2';
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML =
      (c.icon ? '<div class="vt-flex-shrink-0 vt-mt-0.5">' + c.icon + '</div>' : '') +
      '<div class="vt-flex-1 vt-min-w-0">' +
        '<p class="vt-text-sm vt-font-semibold">' + c.title + '</p>' +
        '<p class="vt-text-xs vt-text-foreground-muted vt-mt-0.5">' + c.desc + '</p>' +
      '</div>' +
      (c.btn ? '<button onclick="this.parentElement.remove()" class="vt-flex-shrink-0 vt-inline-flex vt-items-center vt-justify-center vt-rounded-lg vt-text-xs vt-font-medium vt-h-7 vt-px-2 vt-border vt-border-border-strong vt-bg-surface-card vt-hover:bg-surface-subtle vt-transition-colors">' + c.btn + '</button>' : '') +
      '<button onclick="this.parentElement.remove()" aria-label="Close" class="vt-flex-shrink-0 vt-p-0.5 vt-text-foreground-muted vt-hover:text-foreground-primary vt-transition-colors">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vt-w-3.5 vt-h-3.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '</button>';

    container.appendChild(toast);
    setTimeout(function() {
      var el = document.getElementById(id);
      if (el) el.remove();
    }, 4000);
  },

  init: function() {
    // Expose showToast globally for onclick use
    window.showToast = function(type) { UCToast.show(type); };
  }
};

// UCDialog — modal dialog with focus trap and keyboard support
var UCDialog = {
  init: function() {
    // Expose functions globally for onclick use
    window.openDialog = function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el._keyHandler) document.removeEventListener('keydown', el._keyHandler);
      el._previousFocus = document.activeElement;
      el.classList.add('vt-open');
      el.removeAttribute('aria-hidden');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      var focusable = UCDialog._focusable(el)[0];
      if (focusable) focusable.focus();
      el._keyHandler = function(e) {
        if (e.key === 'Escape') { window.closeDialog(id); return; }
        if (e.key !== 'Tab') return;
        var all = UCDialog._focusable(el);
        if (!all.length) return;
        var first = all[0];
        var last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener('keydown', el._keyHandler);
    };

    window.closeDialog = function(id) {
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

// UCTreeView — expandable/collapsible tree nodes
var UCTreeView = {
  init: function() {
    document.querySelectorAll('[data-tree]').forEach(function(tree) {
      if (tree.hasAttribute('data-tree-bound')) return;
      tree.setAttribute('data-tree-bound', 'true');

      tree.querySelectorAll('[data-tree-branch]').forEach(function(branch) {
        var toggle = branch.querySelector(':scope > .vt-tree-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function() {
          branch.classList.toggle('open');
        });
      });
    });
  }
};

// UCFields — small field behaviours declared with data-attributes:
// `[data-password-toggle]`, `[data-pricing]` period switches and `[data-otp]` groups.
var UCFields = {
  init: function() {
    UCFields.initPasswordToggles();
    UCFields.initPricing();
    UCFields.initOtp();
  },

  initPasswordToggles: function() {
    document.querySelectorAll('[data-password-toggle]').forEach(function(button) {
      if (button.dataset.fieldBound) return;
      button.dataset.fieldBound = 'true';

      button.addEventListener('click', function() {
        var input = button.parentElement.querySelector('input');
        if (!input) return;
        var reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
        button.setAttribute('aria-pressed', String(reveal));
      });
    });
  },

  // Monthly/yearly switch: prices and copy come from data-attributes on the
  // price and description nodes so the markup stays the source of truth.
  initPricing: function() {
    document.querySelectorAll('[data-pricing]').forEach(function(group) {
      if (group.dataset.pricingBound) return;
      group.dataset.pricingBound = 'true';

      var toggle = group.querySelector('[data-pricing-toggle]');
      var price = group.querySelector('[data-pricing-price]');
      var description = group.querySelector('[data-pricing-description]');
      if (!toggle || !price) return;

      var monthly = { price: price.dataset.monthly || price.textContent.trim(), description: description ? (description.dataset.monthly || description.textContent.trim()) : '' };
      var yearly = { price: price.dataset.yearly || monthly.price, description: description ? (description.dataset.yearly || monthly.description) : '' };

      toggle.addEventListener('click', function() {
        var isYearly = toggle.getAttribute('aria-checked') !== 'true';
        toggle.setAttribute('aria-checked', String(isYearly));
        toggle.classList.toggle('vt-active', isYearly);
        toggle.classList.toggle('vt-bg-brand-fill', isYearly);
        toggle.classList.toggle('vt-bg-surface-moderate', !isYearly);
        var period = isYearly ? yearly : monthly;
        price.textContent = period.price;
        if (description) description.textContent = period.description;
      });
    });
  },

  // One-time-code cells: typing advances, Backspace retreats, arrows move,
  // and a pasted code is spread across the remaining editable cells.
  initOtp: function() {
    document.querySelectorAll('[data-otp]').forEach(function(group) {
      if (group.dataset.otpBound) return;
      group.dataset.otpBound = 'true';

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
        cell.setAttribute('aria-label', 'Digit ' + (index + 1) + ' of ' + cells.length);
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

// UCCommand — filtering and keyboard navigation for the command palette.
// Markup wires the input with `oninput="filterCommand(this)"` and
// `onkeydown="navigateCommand(event, this)"`; Enter dispatches
// `vt:commandselect` on the highlighted item and updates an optional
// `[data-command-status]` line inside the wrapper.
var UCCommand = {
  itemText: function(item) {
    return item.getAttribute('data-value') || item.textContent.trim();
  },

  highlight: function(items, item) {
    items.forEach(function(candidate) { candidate.classList.toggle('vt-selected', candidate === item); });
    if (item) item.scrollIntoView({ block: 'nearest' });
  },

  filter: function(input) {
    var query = input.value.toLowerCase();
    var wrapper = input.closest('.vt-command-wrapper');
    var items = Array.from(wrapper.querySelectorAll('.vt-command-item'));
    var groups = wrapper.querySelectorAll('[data-command-group]');
    var separators = wrapper.querySelectorAll('.vt-command-separator');
    var emptyEl = wrapper.querySelector('.vt-command-empty');
    var listEl = wrapper.querySelector('.vt-command-list');
    var totalVisible = 0;

    groups.forEach(function(group) {
      var groupVisible = 0;
      group.querySelectorAll('.vt-command-item').forEach(function(item) {
        var matches = UCCommand.itemText(item).toLowerCase().includes(query);
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
    UCCommand.highlight(items, firstVisible);
  },

  navigate: function(e, input) {
    var wrapper = input.closest('.vt-command-wrapper');
    var items = Array.from(wrapper.querySelectorAll('.vt-command-item')).filter(function(item) {
      return !item.classList.contains('vt-hidden');
    });
    var activeIndex = items.findIndex(function(item) { return item.classList.contains('vt-selected'); });

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      UCCommand.highlight(items, items[(activeIndex + 1) % items.length]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      UCCommand.highlight(items, items[(activeIndex - 1 + items.length) % items.length]);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      UCCommand.select(items[activeIndex], input);
    }
  },

  select: function(item, input) {
    var wrapper = input.closest('.vt-command-wrapper');
    var label = item.textContent.trim();
    var status = wrapper.querySelector('[data-command-status]');
    if (status) status.textContent = 'Selected: ' + label;
    item.dispatchEvent(new CustomEvent('vt:commandselect', { bubbles: true, detail: UCCommand.itemText(item) }));
    input.value = '';
    UCCommand.filter(input);
  },

  init: function() {
    // Global names used by inline handlers in the docs and copied examples.
    window.filterCommand = UCCommand.filter;
    window.navigateCommand = UCCommand.navigate;
  }
};

// UCSidebarNav — collapsible sections inside `[data-sidebar-demo]` navigation.
var UCSidebarNav = {
  init: function() {
    document.querySelectorAll('[data-sidebar-demo]').forEach(function(nav) {
      if (nav.dataset.sidebarBound) return;
      nav.dataset.sidebarBound = 'true';

      nav.querySelectorAll('[data-sidebar-collapsible]').forEach(function(section) {
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
    UCAccordion.init();
    UCCalendar.init();
    UCChip.init();
    UCRadioGroup.init();
    UCTabs.init();
    UCCollapsible.init();
    UCCombobox.init();
    UCResizable.init();
    UCCarousel.init();
    UCDropdown.init();
    UCScrollView.init();
    UCNumberInput.init();
    UCPopover.init();
    UCSelect.init();
    UCSlider.init();
    UCToast.init();
    UCDialog.init();
    UCTreeView.init();
    UCFields.init();
    UCCommand.init();
    UCSidebarNav.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('astro:after-swap', function() {
    initAll();
  });

  // Markup added after load — a rendered preview, a fetched fragment, a
  // client-side route — has to be wired the same way. Every component's init
  // is written to be re-run safely (per-element guards, document listeners
  // bound once), so calling this again is cheap and idempotent.
  window.veritheme = window.veritheme || {};
  window.veritheme.init = initAll;
})();
