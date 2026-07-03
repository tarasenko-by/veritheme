/*!
 * uicraft.js v1.1.0
 * https://getuicraft.com
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
        var isOpen = !content.classList.contains('uc-hidden') && !content.classList.contains('hidden');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });

    function openContent(content) {
      content.classList.remove('uc-hidden');
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
    }

    function closeContent(content) {
      content.style.maxHeight = '0px';
      content.classList.remove('open');
      content.addEventListener('transitionend', function handler() {
        if (content.style.maxHeight === '0px') {
          content.classList.add('uc-hidden');
        }
        content.removeEventListener('transitionend', handler);
      });
    }

    document.querySelectorAll('[data-accordion-content]').forEach(function(content) {
      if (!content.classList.contains('uc-hidden') && !content.classList.contains('hidden')) {
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
        var isOpen = !content.classList.contains('uc-hidden') && !content.classList.contains('hidden') && content.classList.contains('open');

        if (mode === 'single') {
          accordion.querySelectorAll('[data-accordion-item]').forEach(function(otherItem) {
            var otherContent = otherItem.querySelector('[data-accordion-content]');
            var otherTrigger = otherItem.querySelector('[data-accordion-trigger]');
            var otherIcon = otherItem.querySelector('[data-accordion-trigger] [data-accordion-icon]');
            if (otherItem !== item && !otherContent.classList.contains('uc-hidden') && !otherContent.classList.contains('hidden')) {
              closeContent(otherContent);
              if (otherIcon) otherIcon.classList.remove('uc-rotate-180');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          closeContent(content);
          if (icon) icon.classList.remove('uc-rotate-180');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          content.classList.remove('uc-hidden');
          content.offsetHeight;
          openContent(content);
          if (icon) icon.classList.add('uc-rotate-180');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
};

// UCCalendar — day selection for [data-calendar="single|range"] grids
var UCCalendar = {
  init: function() {
    document.querySelectorAll('[data-calendar]').forEach(function(cal) {
      if (cal.hasAttribute('data-calendar-bound')) return;
      cal.setAttribute('data-calendar-bound', 'true');
      var mode = cal.getAttribute('data-calendar') || 'single';

      cal.addEventListener('click', function(e) {
        var day = e.target.closest('.uc-calendar-day');
        if (!day || day.classList.contains('uc-outside') || day.classList.contains('uc-muted')) return;
        var days = Array.prototype.slice.call(cal.querySelectorAll('.uc-calendar-day')).filter(function(d) {
          return !d.classList.contains('uc-outside') && !d.classList.contains('uc-muted');
        });

        if (mode === 'range') {
          var idx = days.indexOf(day);
          if (cal._rangeStart == null || cal._rangeDone) {
            days.forEach(function(d) {
              d.classList.remove('uc-range-start', 'uc-range-middle', 'uc-range-end', 'uc-active');
            });
            day.classList.add('uc-range-start');
            cal._rangeStart = idx;
            cal._rangeDone = false;
          } else {
            var a = cal._rangeStart, b = idx;
            if (a === b) return;
            if (b < a) {
              days[a].classList.remove('uc-range-start');
              var t = a; a = b; b = t;
              days[a].classList.add('uc-range-start');
            }
            for (var k = a + 1; k < b; k++) days[k].classList.add('uc-range-middle');
            days[b].classList.add('uc-range-end');
            cal._rangeDone = true;
          }
        } else {
          days.forEach(function(d) { d.classList.remove('uc-active'); });
          day.classList.add('uc-active');
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
      group.querySelectorAll('.uc-chip-btn').forEach(function(btn) {
        var selected = btn.getAttribute('data-selected') === 'true' || btn.classList.contains('uc-chip-active');
        btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
        btn.addEventListener('click', function() {
          var isSelected = btn.getAttribute('data-selected') === 'true';
          btn.setAttribute('data-selected', isSelected ? 'false' : 'true');
          btn.setAttribute('aria-pressed', isSelected ? 'false' : 'true');
          btn.classList.toggle('uc-chip-active', !isSelected);
        });
      });
    });
  }
};

// UCRadioGroup — custom radio circles grouped by [data-group]
var UCRadioGroup = {
  init: function() {
    document.querySelectorAll('[data-group] .uc-radio').forEach(function(radio) {
      var label = radio.closest('label');
      if (!label || label.hasAttribute('data-radio-bound')) return;
      label.setAttribute('data-radio-bound', 'true');
      label.addEventListener('click', function() {
        if (radio.classList.contains('disabled')) return;
        var group = radio.closest('[data-group]');
        group.querySelectorAll('.uc-radio').forEach(function(r) {
          r.classList.remove('selected');
        });
        radio.classList.add('selected');
      });
    });
  }
};

// selectRadio — called via onclick in HTML (docs markup)
function selectRadio(group, el) {
  document.querySelectorAll('[data-group="' + group + '"] .uc-radio').forEach(function(r) {
    r.classList.remove('selected');
  });
  var radio = el.querySelector('.uc-radio');
  if (radio && !radio.classList.contains('disabled')) radio.classList.add('selected');
}

// UCTabs — tab switching for [data-tab-group] with roving-tabindex keyboard nav
var UCTabs = {
  activate: function(container, tabName) {
    container.querySelectorAll('[role="tab"]').forEach(function(t) {
      var isActive = t.getAttribute('data-tab') === tabName;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      t.classList.toggle('uc-active', isActive);
    });
    container.querySelectorAll('[role="tabpanel"]').forEach(function(p) {
      p.classList.toggle('uc-hidden', p.getAttribute('data-panel') !== tabName);
    });
  },

  init: function() {
    document.querySelectorAll('[data-tab-group]').forEach(function(container) {
      if (container.hasAttribute('data-tabs-bound')) return;
      container.setAttribute('data-tabs-bound', 'true');
      container.querySelectorAll('[role="tab"]').forEach(function(tab) {
        tab.addEventListener('click', function() {
          UCTabs.activate(container, tab.getAttribute('data-tab'));
        });
      });
    });

    if (!document.body.hasAttribute('data-tabs-keyboard-init')) {
      document.body.setAttribute('data-tabs-keyboard-init', 'true');
      document.addEventListener('keydown', function(e) {
        var tab = e.target;
        if (!tab || tab.getAttribute('role') !== 'tab') return;
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
        content.classList.remove('uc-hidden');
        if (collapsible.hasAttribute('data-collapsible-animated')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
      if (icon) {
        icon.classList.add('uc-rotate-180');
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
          isOpen = !content.classList.contains('uc-hidden');
        }

        if (isOpen) {
          if (isAnimated) {
            content.style.maxHeight = '0';
          } else {
            content.classList.add('uc-hidden');
          }
          if (icon) icon.classList.remove('uc-rotate-180');
          if (labelCollapse) labelCollapse.classList.add('uc-hidden');
          if (labelExpand) labelExpand.classList.remove('uc-hidden');
          collapsible.removeAttribute('data-collapsible-open');
        } else {
          if (isAnimated) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.classList.remove('uc-hidden');
          }
          if (icon) icon.classList.add('uc-rotate-180');
          if (labelCollapse) labelCollapse.classList.remove('uc-hidden');
          if (labelExpand) labelExpand.classList.add('uc-hidden');
          collapsible.setAttribute('data-collapsible-open', '');
        }
      });
    });
  }
};

// UCCombobox — searchable single/multi-select with tags
var UCCombobox = {
  init: function() {
    var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-w-4 uc-h-4 uc-shrink-0 uc-text-accents-brand uc-combobox-icon"><path d="M20 6 9 17l-5-5"/></svg>';
    var emptySpacer = '<span class="uc-w-4 uc-h-4 uc-shrink-0 uc-combobox-icon"></span>';
    var xTagSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-w-3 uc-h-3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

    // Close on click outside
    if (!document.body.hasAttribute('data-combobox-outside-init')) {
      document.body.setAttribute('data-combobox-outside-init', 'true');
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.uc-combobox-wrapper')) {
          document.querySelectorAll('[data-combobox-content]').forEach(function(el) {
            el.classList.remove('uc-open');
          });
        }
      });
    }

    // Expose functions globally for inline onclick use
    window.openCombobox = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('uc-open');
    };

    window.toggleCombobox = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('uc-open');
    };

    window.filterCombobox = function(input, id) {
      var dropdown = document.getElementById(id);
      var query = input.value.toLowerCase();
      var items = dropdown.querySelectorAll('.uc-combobox-item');
      var groups = dropdown.querySelectorAll('[data-combobox-group]');
      var emptyEl = dropdown.querySelector('.uc-combobox-empty');
      var totalVisible = 0;

      if (groups.length > 0) {
        groups.forEach(function(group) {
          var groupItems = group.querySelectorAll('.uc-combobox-item');
          var groupVisible = 0;
          groupItems.forEach(function(item) {
            if (item.textContent.toLowerCase().includes(query)) {
              item.classList.remove('uc-hidden');
              groupVisible++;
              totalVisible++;
            } else {
              item.classList.add('uc-hidden');
            }
          });
          group.style.display = groupVisible > 0 ? '' : 'none';
        });
      } else {
        items.forEach(function(item) {
          if (item.textContent.toLowerCase().includes(query)) {
            item.classList.remove('uc-hidden');
            totalVisible++;
          } else {
            item.classList.add('uc-hidden');
          }
        });
      }

      if (emptyEl) {
        emptyEl.classList.toggle('uc-hidden', totalVisible > 0 || !query);
      }
    };

    function setItemIcon(item, checked) {
      var icon = item.querySelector('.uc-combobox-icon');
      if (icon) icon.outerHTML = checked ? checkSvg : emptySpacer;
    }

    window.selectComboboxItem = function(item) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.uc-combobox-wrapper');
      var keepIcons = wrapper.hasAttribute('data-keep-icons');
      var input = wrapper.querySelector('input');
      var dropdown = item.closest('[data-combobox-content]');

      input.value = text;

      dropdown.querySelectorAll('.uc-combobox-item').forEach(function(i) {
        i.classList.remove('uc-selected');
        if (!keepIcons) setItemIcon(i, false);
      });
      item.classList.add('uc-selected');
      if (!keepIcons) setItemIcon(item, true);

      dropdown.classList.remove('uc-open');
    };

    window.selectComboboxButton = function(item, dropdownId) {
      var text = item.textContent.trim();
      var wrapper = item.closest('.uc-combobox-wrapper');
      var label = wrapper.querySelector('.uc-combobox-button-label');
      var dropdown = document.getElementById(dropdownId);

      label.textContent = text;
      label.classList.remove('uc-text-mains-quaternary');

      dropdown.querySelectorAll('.uc-combobox-item').forEach(function(i) {
        i.classList.remove('uc-selected');
        setItemIcon(i, false);
      });
      item.classList.add('uc-selected');
      setItemIcon(item, true);

      dropdown.classList.remove('uc-open');
    };

    window.toggleMultiComboboxItem = function(item) {
      var isSelected = item.classList.toggle('uc-selected');
      setItemIcon(item, isSelected);

      var wrapper = item.closest('.uc-combobox-wrapper');
      var tagContainer = wrapper.querySelector('.uc-combobox-tags');
      var text = item.textContent.trim();

      if (isSelected) {
        var tag = document.createElement('span');
        tag.className = 'uc-combobox-tag uc-inline-flex uc-items-center uc-gap-1 uc-rounded uc-bg-surfaces-subtle uc-px-2 uc-py-0.5 uc-text-xs uc-font-medium';
        tag.setAttribute('data-tag-value', text);
        tag.appendChild(document.createTextNode(text));
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'uc-ml-0.5 uc-rounded-sm uc-hover:bg-surfaces-moderate uc-transition-colors';
        removeBtn.innerHTML = xTagSvg;
        removeBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          window.removeComboboxTag(removeBtn);
        });
        tag.appendChild(removeBtn);
        tagContainer.insertBefore(tag, tagContainer.querySelector('input'));
      } else {
        var existing = tagContainer.querySelector('[data-tag-value="' + text + '"]');
        if (existing) existing.remove();
      }

      UCCombobox._updateMultiPlaceholder(wrapper);
    };

    window.removeComboboxTag = function(btn) {
      var tag = btn.closest('.uc-combobox-tag');
      if (!tag) return;
      var value = tag.getAttribute('data-tag-value');
      var wrapper = tag.closest('.uc-combobox-wrapper');
      tag.remove();

      var dropdown = wrapper.querySelector('[data-combobox-content]');
      if (dropdown) {
        dropdown.querySelectorAll('.uc-combobox-item').forEach(function(item) {
          if (item.textContent.trim() === value) {
            item.classList.remove('uc-selected');
            setItemIcon(item, false);
          }
        });
      }

      UCCombobox._updateMultiPlaceholder(wrapper);
    };
  },

  _updateMultiPlaceholder: function(wrapper) {
    var input = wrapper.querySelector('input');
    var tags = wrapper.querySelectorAll('.uc-combobox-tag');
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
      var handles = container.querySelectorAll(':scope > .uc-resize-handle');

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
          handle.style.background = 'hsl(var(--accents-brand) / 0.5)';
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

          var prevLabel = prevPanel.querySelector('.uc-size-label');
          var nextLabel = nextPanel.querySelector('.uc-size-label');
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
            dot.className = 'uc-w-2 uc-h-2 uc-rounded-full uc-transition-colors ' + (idx === current ? 'uc-bg-accents-brand' : 'uc-bg-surfaces-moderate');
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

// UCDropdown — dropdown menu with checkbox and radio item support
var UCDropdown = {
  init: function() {
    // Document-level listeners once; trigger binding runs every init so
    // nodes added after page load (astro:after-swap) still get wired.
    if (!document.body.hasAttribute('data-dropdowns-init')) {
      document.body.setAttribute('data-dropdowns-init', 'true');

      document.addEventListener('click', function(e) {
        if (!e.target.closest('[data-dropdown-trigger]') && !e.target.closest('.uc-dropdown-menu')) {
          document.querySelectorAll('.uc-dropdown-menu').forEach(function(el) {
            // Combobox reuses .uc-dropdown-menu for its panel and manages
            // open/close itself — closing it here fights the combobox.
            if (el.closest('.uc-combobox-wrapper')) return;
            el.classList.remove('uc-open');
          });
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.uc-dropdown-menu.uc-open').forEach(function(el) {
            el.classList.remove('uc-open');
          });
          document.querySelectorAll('[data-dropdown-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    document.querySelectorAll('[data-dropdown-trigger]').forEach(function(trigger) {
      if (trigger.hasAttribute('data-dropdown-bound')) return;
      trigger.setAttribute('data-dropdown-bound', 'true');
      var targetId = trigger.getAttribute('data-dropdown-trigger');
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', 'false');
      if (targetId) trigger.setAttribute('aria-controls', targetId);
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        var content = document.getElementById(targetId);
        if (!content) return;

        document.querySelectorAll('.uc-dropdown-menu').forEach(function(el) {
          if (el !== content) el.classList.remove('uc-open');
        });

        var willOpen = !content.classList.contains('uc-open');
        content.classList.toggle('uc-open');
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }
};

// Checkbox toggle — called via onclick in HTML
function toggleCheckbox(el) {
  var indicator = el.querySelector('.checkbox-indicator');
  var isChecked = indicator.classList.contains('uc-bg-accents-brand');

  if (isChecked) {
    indicator.classList.remove('uc-bg-accents-brand', 'uc-text-generic-white', 'uc-border-transparent');
    indicator.innerHTML = '';
    el.setAttribute('aria-checked', 'false');
  } else {
    indicator.classList.add('uc-bg-accents-brand', 'uc-text-generic-white', 'uc-border-transparent');
    indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="uc-w-3 uc-h-3"><path d="M20 6 9 17l-5-5"/></svg>';
    el.setAttribute('aria-checked', 'true');
  }
}

// Menu radio select — called via onclick in HTML
function selectMenuRadio(el) {
  var parent = el.closest('.uc-dropdown-menu');
  parent.querySelectorAll('.radio-indicator').forEach(function(r) {
    r.classList.remove('uc-border-accents-brand');
    r.classList.add('uc-border-input');
    r.innerHTML = '';
  });

  var indicator = el.querySelector('.radio-indicator');
  indicator.classList.remove('uc-border-input');
  indicator.classList.add('uc-border-accents-brand');
  indicator.innerHTML = '<div class="uc-w-2 uc-h-2 uc-rounded-full uc-bg-accents-brand"></div>';
}

// UCScrollView — drag-to-scroll and scroll indicators
var UCScrollView = {
  init: function() {
    // Drag-to-scroll for horizontal containers
    document.querySelectorAll('.uc-drag-scroll').forEach(function(el) {
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
    document.querySelectorAll('.uc-scroll-indicator').forEach(function(indicator) {
      if (indicator.hasAttribute('data-indicator-init')) return;
      indicator.setAttribute('data-indicator-init', 'true');

      var scroll = indicator.querySelector('.uc-scroll, .uc-scroll-hidden, .uc-scroll-autohide');
      if (!scroll) return;

      scroll.addEventListener('scroll', function() {
        var st = scroll.scrollTop;
        var sh = scroll.scrollHeight;
        var ch = scroll.clientHeight;
        indicator.classList.toggle('uc-show-top', st > 8);
        indicator.classList.toggle('uc-show-bottom', st < sh - ch - 8);
      });
    });

    // Scroll indicators — horizontal
    document.querySelectorAll('.uc-scroll-indicator-h').forEach(function(indicator) {
      if (indicator.hasAttribute('data-indicator-h-init')) return;
      indicator.setAttribute('data-indicator-h-init', 'true');

      var scroll = indicator.querySelector('.uc-scroll, .uc-scroll-hidden, .uc-scroll-autohide, [class*="uc-overflow-x"]');
      if (!scroll) return;

      scroll.addEventListener('scroll', function() {
        var sl = scroll.scrollLeft;
        var sw = scroll.scrollWidth;
        var cw = scroll.clientWidth;
        indicator.classList.toggle('uc-show-left', sl > 8);
        indicator.classList.toggle('uc-show-right', sl < sw - cw - 8);
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

      function updateButtons() {
        var val = parseInt(input.value) || 0;
        var min = input.hasAttribute('min') ? parseInt(input.min) : -Infinity;
        var max = input.hasAttribute('max') ? parseInt(input.max) : Infinity;
        if (decBtn) decBtn.disabled = val <= min;
        if (incBtn) incBtn.disabled = val >= max;
      }

      function step(delta) {
        var val = parseInt(input.value) || 0;
        var min = input.hasAttribute('min') ? parseInt(input.min) : -Infinity;
        var max = input.hasAttribute('max') ? parseInt(input.max) : Infinity;
        var next = Math.min(Math.max(val + delta, min), max);
        input.value = next;
        updateButtons();
      }

      if (decBtn) decBtn.addEventListener('click', function() { step(-1); });
      if (incBtn) incBtn.addEventListener('click', function() { step(1); });

      input.addEventListener('change', function() {
        var min = input.hasAttribute('min') ? parseInt(input.min) : -Infinity;
        var max = input.hasAttribute('max') ? parseInt(input.max) : Infinity;
        var val = parseInt(input.value) || min;
        input.value = Math.min(Math.max(val, min), max);
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

        var isOpen = el.classList.contains('uc-open');

        document.querySelectorAll('.uc-popover-content').forEach(function(p) {
          p.classList.remove('uc-open');
        });
        document.querySelectorAll('[data-popover-trigger]').forEach(function(t) {
          t.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          el.classList.add('uc-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      };
    });

    if (!document.body.hasAttribute('data-popover-outside-init')) {
      document.body.setAttribute('data-popover-outside-init', 'true');
      document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.closest('.uc-popover-content') && !target.closest('[data-popover-trigger]')) {
          document.querySelectorAll('.uc-popover-content').forEach(function(p) {
            p.classList.remove('uc-open');
          });
          document.querySelectorAll('[data-popover-trigger]').forEach(function(t) {
            t.setAttribute('aria-expanded', 'false');
          });
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.uc-popover-content').forEach(function(p) {
            p.classList.remove('uc-open');
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
      if (!e.target.closest('.uc-select-wrapper')) {
        document.querySelectorAll('.uc-select-dropdown').forEach(function(d) {
          d.classList.remove('open');
        });
      }
    });
  }
};

// toggleSelect — called via onclick in HTML
function toggleSelect(id) {
  var dropdown = document.getElementById(id);
  document.querySelectorAll('.uc-select-dropdown').forEach(function(d) {
    if (d.id !== id) d.classList.remove('open');
  });
  dropdown.classList.toggle('open');
}

// selectItem — called via onclick in HTML
function selectItem(id, triggerId, value) {
  document.getElementById(triggerId).querySelector('span').textContent = value;
  document.getElementById(triggerId).querySelector('span').classList.remove('placeholder');
  var dropdown = document.getElementById(id);
  dropdown.querySelectorAll('.uc-select-item').forEach(function(i) {
    i.classList.remove('selected');
  });
  dropdown.querySelectorAll('.uc-select-item').forEach(function(i) {
    if (i.textContent.trim() === value) i.classList.add('selected');
  });
  dropdown.classList.remove('open');
}

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
      container.className = 'uc-fixed uc-bottom-4 uc-right-4 uc-z-50 uc-flex uc-flex-col uc-items-end';
      document.body.appendChild(container);
    }

    var id = 'toast-' + (++UCToast._count);
    var configs = {
      default: { title: 'Scheduled: Catch up', desc: 'Friday, February 14, 2026 at 5:57 PM', icon: '', btn: 'Undo' },
      success: { title: 'Success', desc: 'Your changes have been saved.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-w-5 uc-h-5 uc-text-accents-brand"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>', btn: '' },
      error: { title: 'Error', desc: 'Something went wrong. Please try again.', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-w-5 uc-h-5 uc-text-error-primary"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', btn: 'Retry' },
      action: { title: 'Event created', desc: 'Sunday, December 03, 2023', icon: '', btn: 'Undo' }
    };

    var c = configs[type] || configs.default;
    var toast = document.createElement('div');
    toast.id = id;
    toast.className = 'uc-flex uc-items-start uc-gap-3 uc-w-80 uc-p-4 uc-rounded-lg uc-border uc-border-border-default uc-bg-surfaces-surface uc-shadow-lg uc-mb-2';
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML =
      (c.icon ? '<div class="uc-flex-shrink-0 uc-mt-0.5">' + c.icon + '</div>' : '') +
      '<div class="uc-flex-1 uc-min-w-0">' +
        '<p class="uc-text-sm uc-font-semibold">' + c.title + '</p>' +
        '<p class="uc-text-xs uc-text-mains-quaternary uc-mt-0.5">' + c.desc + '</p>' +
      '</div>' +
      (c.btn ? '<button onclick="this.parentElement.remove()" class="uc-flex-shrink-0 uc-inline-flex uc-items-center uc-justify-center uc-rounded-lg uc-text-xs uc-font-medium uc-h-7 uc-px-2 uc-border uc-border-border-strong uc-bg-surfaces-surface uc-hover:bg-surfaces-subtle uc-transition-colors">' + c.btn + '</button>' : '') +
      '<button onclick="this.parentElement.remove()" aria-label="Close" class="uc-flex-shrink-0 uc-p-0.5 uc-text-mains-quaternary uc-hover:text-mains-primary uc-transition-colors">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-w-3.5 uc-h-3.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
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
      el.classList.add('uc-open');
      el.removeAttribute('aria-hidden');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      var focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
      el._keyHandler = function(e) {
        if (e.key === 'Escape') { window.closeDialog(id); return; }
        if (e.key !== 'Tab') return;
        var all = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
      el.classList.remove('uc-open');
      el.setAttribute('aria-hidden', 'true');
      if (el._keyHandler) document.removeEventListener('keydown', el._keyHandler);
      if (el._previousFocus && typeof el._previousFocus.focus === 'function') {
        el._previousFocus.focus();
      }
      el._keyHandler = null;
      el._previousFocus = null;
    };
  }
};

// UCTreeView — expandable/collapsible tree nodes
var UCTreeView = {
  init: function() {
    document.querySelectorAll('[data-tree]').forEach(function(tree) {
      if (tree.hasAttribute('data-tree-bound')) return;
      tree.setAttribute('data-tree-bound', 'true');

      tree.querySelectorAll('[data-tree-branch]').forEach(function(branch) {
        var toggle = branch.querySelector(':scope > .uc-tree-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function() {
          branch.classList.toggle('open');
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('astro:after-swap', function() {
    initAll();
  });
})();
