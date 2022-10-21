import { DetailedHTMLProps, FC, ForwardRefExoticComponent, HTMLAttributes, ReactNode } from 'react';
import { Focusable, FocusableProps, GamepadEvent, GamepadButton, ServerAPI } from 'decky-frontend-lib';
import React, { RefObject, ReactElement, useRef } from 'react';

const DEFAULTSCROLLSPEED = 50;

export interface ScrollableElement extends HTMLDivElement {}

export function scrollableRef() {
    return useRef<ScrollableElement>(null);
}

export const Scrollable: ForwardRefExoticComponent<any> = React.forwardRef((props, ref) => {
    if (!props.style) {
        props.style = {}
    }
    // props.style.minHeight = '100%';
    // props.style.maxHeight = '80%';
    props.style.height = '95vh';
    props.style.overflowY = 'scroll';

    return (
        <React.Fragment>
            <div ref={ref} {...props}/>
        </React.Fragment>
    )
})

interface ScrollAreaProps extends FocusableProps {
    scrollable: React.RefObject<ScrollableElement>,
    scrollSpeed?: number,
}

// const writeLog = async (serverApi: ServerAPI, content: any) => {
//     let text = `${content}`;
//     serverApi.callPluginMethod<{content: string}>("log", {content: text});
// };


const scrollOnDirection = (
    e: GamepadEvent,
    ref: React.RefObject<ScrollableElement>,
    amt: number,
) => {
    let childNodes = ref.current?.childNodes;
    let currentIndex = null;
    childNodes?.forEach((node, i) => {
        if (node == e.currentTarget) {
            currentIndex = i;
        }
    });

    // @ts-ignore
    let pos = e.currentTarget?.getBoundingClientRect();
    let out = ref.current?.getBoundingClientRect();

    if (e.detail.button == GamepadButton.DIR_DOWN) {
        if (out?.bottom != undefined
            && pos.bottom <= out.bottom
            && currentIndex != null
            && childNodes != undefined
            && currentIndex + 1 < childNodes.length) {
            const child = childNodes[currentIndex + 1] as HTMLElement;
            child.focus();
        } else {
            ref.current?.scrollBy({top: amt, behavior: 'smooth'});
        }
    } else if (e.detail.button == GamepadButton.DIR_UP) {
        if (out?.top != undefined
            && pos.top >= out.top
            && currentIndex != null
            && childNodes != undefined
            && currentIndex - 1 >= 0) {
            const child = childNodes[currentIndex - 1] as HTMLElement;
            child.focus();
        } else {
            ref.current?.scrollBy({top: -amt, behavior: 'smooth'});
        }
    }
}

export const ScrollArea: FC<ScrollAreaProps> = (props) => {

    let scrollSpeed = DEFAULTSCROLLSPEED;
    if (props.scrollSpeed) {
        scrollSpeed = props.scrollSpeed;
    };
    
    props.onActivate = (e) => {
        const ele = e.currentTarget as HTMLElement;
        ele.focus();
    };
    props.onGamepadDirection = (e) => {scrollOnDirection(
        e,
        props.scrollable,
        scrollSpeed,
    )};

    return <Focusable {...props}/>
}
