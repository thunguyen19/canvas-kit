import React, {useState, useEffect, useCallback} from 'react';

import {createComponent} from '@workday/canvas-kit-react/common';
import {CanvasSystemIcon} from '@workday/design-assets-types';
import {colors, space, CanvasSpaceValues} from '@workday/canvas-kit-react/tokens';
import {TertiaryButton, TertiaryButtonProps} from '@workday/canvas-kit-react/button';
import {chevronLeftIcon, chevronRightIcon} from '@workday/canvas-system-icons-web';
import {Heading} from '@workday/canvas-kit-react/text';
import {system} from '@workday/canvas-tokens-web';
import {calc, createStencil, cssVar, handleCsProp, px2rem} from '@workday/canvas-kit-styling';
import styled from '@emotion/styled';
import {background} from '../../layout';

export interface SidePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, set the SidePanel to the open state.
   * @default false;
   */
  open: boolean;
  /**
   * The function called when the toggle button is clicked. The toggle button is only shown if this prop is defined.
   */
  onToggleClick?: () => void;
  /**
   * The text or element to display as the SidePanel header.
   */
  header?: string | React.ReactNode;
  /**
   * The side from which the SidePanel opens. Accepts `Left` or `Right`.
   * @default SidePanelOpenDirection.Left
   */
  openDirection?: SidePanelOpenDirection;
  /**
   * The function called when the window width changes and reaches a width equivalent to `breakpoint`. For example, if the window is resized from a width of `1000px`, this will be called when the window reaches a width equivalent to `breakpoint`. The `aboveBreakpoint` argument passed to the callback function indicates whether the current window width is above or below `breakpoint` so you can control `open` based on the change.
   */
  onBreakpointChange?: (aboveBreakpoint: boolean) => void;
  /**
   * The padding of the SidePanel when it's open.
   */
  padding?: CanvasSpaceValues;
  /**
   * The window width at which the SidePanel triggers `onBreakPointChange`.
   * @default 768px
   */
  breakpoint?: number;
  /**
   * The width of the SidePanel when it's open.
   * @default 300px
   */
  openWidth?: number;
  /**
   * The background color of the SidePanel when it's open.
   * @default SidePanelBackgroundColor.White
   */
  backgroundColor?: SidePanelBackgroundColor;
  /**
   * The `aria-label` that describes closing the navigation.
   * @default 'close navigation'
   */
  closeNavigationAriaLabel?: string;
  /**
   * The `aria-label` that describes opening the navigation.
   * @default 'open navigation'
   */
  openNavigationAriaLabel?: string;
}

export interface SidePanelState {
  screenSize: number;
}

export enum SidePanelOpenDirection {
  Left,
  Right,
}

export enum SidePanelBackgroundColor {
  White,
  Transparent,
  Gray,
}

const getOpenBackgroundColor = (backgroundColor?: SidePanelBackgroundColor): string => {
  switch (backgroundColor) {
    case SidePanelBackgroundColor.Transparent:
      return 'transparent';
    case SidePanelBackgroundColor.Gray:
      return colors.soap100;
    case SidePanelBackgroundColor.White:
    default:
      return colors.frenchVanilla100;
  }
};

const closedWidth = space.xxl;

export const sidePanelStencil = createStencil({
  vars: {
    bg: '',
    openWidth: '',
    padding: '',
    backgroundColor: '',
  },
  base: () => ({
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms ease',
    position: 'absolute',
    '[data-part="children"]': {
      transition: 'none',
      zIndex: 1,
    },
    '[data-part="toggle-btn"]': {
      position: 'absolute',
      bottom: system.space.x4,
    },
  }),
  modifiers: {
    open: {
      true: ({openWidth}) => ({
        backgroundColor: system.color.bg.default,
        // backgroundColor: cssVar(getOpenBackgroundColor(SidePanelBackgroundColor.White)),
        // width: openWidth,
        '[data-part="children"]': {
          width: openWidth,
        },
      }),
      false: {
        alignItems: 'center',
        boxShadow: '0 8px 16px -8px rgba(0, 0, 0, 0.16)',
        backgroundColor: system.color.bg.default,
        width: system.space.x16,
        '[data-part="children"]': {
          width: system.space.x10,
        },
      },
    },
  },
});

const childrenStencil = createStencil({
  vars: {
    openWidth: '',
  },
  base: {
    transition: 'none',
    zIndex: 1,
  },
  modifiers: {
    open: {
      true: ({openWidth}) => ({
        width: openWidth,
      }),
      false: {
        width: system.space.x10,
      },
    },
  },
});

const sidePanelFooterStencil = createStencil({
  vars: {
    openWidth: '',
  },
  base: () => ({
    position: 'absolute',
    bottom: system.space.zero,
    height: calc.multiply(system.space.x10, 3),
    left: system.space.zero,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.0001) 0%, #FFFFFF 100%)',
  }),
  modifiers: {
    open: {
      true: ({openWidth}) => ({
        width: openWidth,
      }),
      false: {
        width: system.space.x10,
      },
    },
  },
});

const toggleButtonDirection = (
  open: boolean,
  openDirection?: SidePanelOpenDirection
): CanvasSystemIcon => {
  if (openDirection !== SidePanelOpenDirection.Right) {
    return open ? chevronLeftIcon : chevronRightIcon;
  } else {
    return open ? chevronRightIcon : chevronLeftIcon;
  }
};

const mapBackgroundColor = (open: boolean, backgroundColor?: SidePanelBackgroundColor): string => {
  let openBackgroundColor;

  switch (backgroundColor) {
    case SidePanelBackgroundColor.Transparent:
      openBackgroundColor = 'transparent';
      break;
    case SidePanelBackgroundColor.Gray:
      openBackgroundColor = colors.soap100;
      break;
    case SidePanelBackgroundColor.White:
    default:
      openBackgroundColor = colors.frenchVanilla100;
      break;
  }

  return open ? openBackgroundColor : colors.frenchVanilla100;
};

export const SidePanel = createComponent('div')({
  displayName: 'SidePanel',
  Component: (
    {
      children,
      backgroundColor = SidePanelBackgroundColor.White,
      openNavigationAriaLabel = 'open navigation',
      closeNavigationAriaLabel = 'close navigation',
      openDirection = SidePanelOpenDirection.Left,
      breakpoint = 768,
      openWidth = 300,
      header,
      onToggleClick,
      open,
      padding,
      onBreakpointChange,
      ...elemProps
    }: SidePanelProps,
    ref,
    Element
  ) => {
    const [screenSize, setScreenSize] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 0
    );

    const handleResize = useCallback(() => {
      if (!onBreakpointChange || !breakpoint) {
        return;
      }

      if (window.innerWidth > breakpoint && !open) {
        onBreakpointChange(true);
      }
      if (window.innerWidth <= breakpoint && open) {
        onBreakpointChange(false);
      }
    }, [onBreakpointChange, breakpoint, open]);

    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [handleResize]);

    return (
      <Element
        ref={ref}
        role="region"
        {...handleCsProp(
          elemProps,
          sidePanelStencil({
            open: open,
            // backgroundColor: 'yo',
          })
        )}
      >
        {/* <Element ref={ref} data-part="children">
          {header && open ? (
            <Heading as="h2" size="small" marginTop="zero">
              {header}
            </Heading>
          ) : null}
          {children}
        </Element> */}
        <div
          {...childrenStencil({
            open,
            openWidth: typeof openWidth === 'number' ? px2rem(openWidth) : openWidth,
          })}
        >
          {header && open ? (
            <Heading as="h2" size="small" marginTop="zero">
              {header}
            </Heading>
          ) : null}
          {children}
        </div>
        <div
          {...sidePanelFooterStencil({
            open,
            openWidth: typeof openWidth === 'number' ? px2rem(openWidth) : openWidth,
          })}
        >
          {onToggleClick && (
            <TertiaryButton
              data-part="toggle-btn"
              aria-label={open ? closeNavigationAriaLabel : openNavigationAriaLabel}
              onClick={onToggleClick}
              icon={toggleButtonDirection(open, openDirection)}
              right={openDirection === SidePanelOpenDirection.Left ? space.s : ''}
              left={openDirection === SidePanelOpenDirection.Right ? space.s : ''}
            />
          )}
        </div>
      </Element>
    );
  },
});
