import * as React from 'react';
import styled from '@emotion/styled';

import {createComponent} from '@workday/canvas-kit-react/common';
import {CanvasSystemIcon} from '@workday/design-assets-types';
import {colors, space, CanvasSpaceValues} from '@workday/canvas-kit-react/tokens';
import {TertiaryButton, TertiaryButtonProps} from '@workday/canvas-kit-react/button';
import {chevronLeftIcon, chevronRightIcon} from '@workday/canvas-system-icons-web';
import {Heading} from '@workday/canvas-kit-react/text';
import {system} from '@workday/canvas-tokens-web';
import {calc, createStencil, cssVar, handleCsProp} from '@workday/canvas-kit-styling';

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

const closedWidth = space.xxl;

export const sidePanelStencil = createStencil({
  vars: {
    open: '',
    height: '',
    backgroundColor: '',
    openNavigationAriaLabel: '',
    closeNavigationAriaLabel: '',
    padding: '',
    openDirection: '',
  },
  base: ({
    openDirection,
    padding,
    open,
    backgroundColor,
    openNavigationAriaLabel,
    closeNavigationAriaLabel,
  }) => ({
    role: 'region',
    overflow: 'hidden',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms ease',
    position: 'absolute',
    // backgroundColor: cssVar(backgroundColor, system.color.bg.alt.strong),
    width: open ? calc.multiply(system.space.x1, 75) : system.space.x10,
    padding: open ? padding || space.m : `${space.s} 0`,
    alignItems: open ? undefined : 'center',
    boxShadow: open ? undefined : '0 8px 16px -8px rgba(0, 0, 0, 0.16)',
    // backgroundColor: open ? getOpenBackgroundColor(backgroundColor) : colors.frenchVanilla100,
    // right: openDirection === SidePanelOpenDirection.Right ? space.zero : undefined,
    // left: openDirection === SidePanelOpenDirection.Left ? space.zero : undefined,
  }),
});

const childrenStencil = createStencil({
  vars: {
    open: '',
  },
  base: ({open}) => ({
    transition: 'none',
    zIndex: 1, // show above SidePanelFooter when screen is small vertically
    width: open ? calc.multiply(system.space.x1, 75) : system.space.x10,
  }),
});

const toggleButtonStencil = createStencil({
  vars: {
    openDirection: '',
  },
  base: ({openDirection}) => ({
    position: 'absolute',
    bottom: space.s,
    // right: openDirection === SidePanelOpenDirection.Left ? space.s : '',
    // left: openDirection === SidePanelOpenDirection.Right ? space.s : '',
  }),
});

const sidePanelFooterStencil = createStencil({
  vars: {
    open: '',
  },
  base: ({open}) => ({
    position: 'absolute',
    bottom: system.space.zero,
    height: calc.multiply(system.space.x10, 3),
    left: system.space.zero,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.0001) 0%, #FFFFFF 100%)',
    width: open ? calc.multiply(system.space.x1, 75) : system.space.x10,
  }),
});

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

export const SidePanel = createComponent('div')({
  displayName: 'SidePanel',
  Component: (
    {
      children,
      backgroundColor,
      header,
      open,
      onToggleClick,
      openDirection,
      closeNavigationAriaLabel,
      openNavigationAriaLabel,
      ...elemProps
    }: SidePanelProps,
    ref,
    Element
  ) => {
    const [screenSize, setScreenSize] = React.useState(window.innerWidth || 0);

    return (
      <Element
        ref={ref}
        {...handleCsProp(
          elemProps,
          sidePanelStencil({
            backgroundColor: 'yo',
            openNavigationAriaLabel,
            closeNavigationAriaLabel,
          })
        )}
      >
        <div {...childrenStencil({open: open ? 'open' : ''})}>
          {header && open ? (
            <Heading as="h2" size="small" marginTop="zero">
              {header}
            </Heading>
          ) : null}
          {children}
        </div>
        <div {...sidePanelFooterStencil({open: open ? 'open' : ''})}>
          {onToggleClick && (
            <TertiaryButton
              aria-label={open ? closeNavigationAriaLabel : openNavigationAriaLabel}
              icon={toggleButtonDirection(open, openDirection)}
              onClick={onToggleClick}
              cs={toggleButtonStencil({openDirection: 'openDirection'})}
            />
          )}
        </div>
      </Element>
    );
  },
});
