import React, { useEffect, useMemo, useRef, useState } from 'react';

function formatDateLabel(date: Date | null) {
  if (!date) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, n: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarGrid(viewDate: Date) {
  const first = startOfMonth(viewDate);
  const last = endOfMonth(viewDate);
  const startOffset = first.getDay();

  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startOffset);

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return { cells, first, last };
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']; // Sunday start

export default function MiniCalendarButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<Date>(new Date()); // For roving focus
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { cells } = useMemo(() => getCalendarGrid(viewDate), [viewDate]);

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  function selectDate(d: Date) {
    setSelected(d);
    setActiveDate(d);
    // Keep the popover open after selection
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    const deltaByKey: Record<string, number | null> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (k in deltaByKey) {
      e.preventDefault();
      const delta = deltaByKey[k]!;
      const nd = new Date(activeDate);
      nd.setDate(activeDate.getDate() + delta);
      setActiveDate(nd);
      return;
    }
    if (k === 'Home') {
      e.preventDefault();
      const nd = new Date(activeDate);
      nd.setDate(activeDate.getDate() - activeDate.getDay()); // go to Sunday
      setActiveDate(nd);
      return;
    }
    if (k === 'End') {
      e.preventDefault();
      const nd = new Date(activeDate);
      nd.setDate(activeDate.getDate() + (6 - activeDate.getDay())); // go to Saturday
      setActiveDate(nd);
      return;
    }
    if (k === 'PageUp') {
      e.preventDefault();
      setViewDate(addMonths(viewDate, -1));
      return;
    }
    if (k === 'PageDown') {
      e.preventDefault();
      setViewDate(addMonths(viewDate, 1));
      return;
    }
    if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      selectDate(activeDate);
    }
  }

  const today = new Date();

  return (
    <div className='relative inline-block text-left'>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className='inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white text-black dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-controls='mini-cal-popover'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-4 w-4 opacity-80'>
          <path d='M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8ZM5 7h14a1 1 0 0 1 1 1v1H4V8a1 1 0 0 1 1-1Z' />
        </svg>
        {formatDateLabel(selected)}
      </button>

      {open && (
        <div
          id='mini-cal-popover'
          ref={popoverRef}
          role='dialog'
          aria-modal='true'
          className='absolute z-50 mt-2 w-72 origin-top-right rounded-2xl border border-gray-200 bg-white text-black dark:bg-gray-700 dark:text-white p-3 shadow-2xl focus:outline-none'
          onKeyDown={onKeyDown}>
          {/* Header: month navigation */}
          <div className='mb-2 flex items-center justify-between'>
            <button
              onClick={() => setViewDate(addMonths(viewDate, -1))}
              className='rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              aria-label='Previous month'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4'>
                <path d='M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
              </svg>
            </button>
            <div className='text-sm font-semibold'>
              {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className='rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              aria-label='Next month'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4'>
                <path d='M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z' />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className='grid grid-cols-7 gap-1 px-1 pb-1'>
            {WEEKDAYS.map((d) => (
              <div key={d} className='text-center text-xs font-medium text-gray-500'>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className='grid grid-cols-7 gap-1'>
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === viewDate.getMonth();
              const isToday = isSameDay(d, today);
              const isSelected = selected && isSameDay(d, selected);
              const isActive = isSameDay(d, activeDate);

              return (
                <button
                  key={i}
                  onClick={() => selectDate(d)}
                  onMouseEnter={() => inMonth && setActiveDate(d)}
                  className={[
                    'relative flex h-9 items-center justify-center rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    inMonth ? 'text-gray-900' : 'text-gray-400',
                    isSelected ? 'bg-blue-600 text-white hover:bg-blue-600' : 'hover:bg-gray-100',
                    isActive && !isSelected ? 'ring-2 ring-blue-500' : '',
                  ].join(' ')}
                  aria-current={isToday ? 'date' : undefined}
                  aria-selected={!!isSelected}>
                  <span className='tabular-nums'>{d.getDate()}</span>
                  {isToday && !isSelected && (
                    <span
                      className='absolute bottom-1 h-1 w-1 rounded-full bg-blue-500'
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className='mt-3 flex items-center justify-between'>
            <button
              className='rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100'
              onClick={() => {
                const t = new Date();
                setViewDate(startOfMonth(t));
                setActiveDate(t);
              }}>
              Jump to today
            </button>
            <div className='flex items-center gap-2'>
              <button
                className='rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100'
                onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className='rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700'
                onClick={() => {
                  if (activeDate) selectDate(activeDate);
                }}>
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
