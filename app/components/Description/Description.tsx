import { ReactElement, createElement } from "react";
import Typography, {TypographyProps} from "@mui/material/Typography";
import { BaseLink } from "../Links";

const BANNED_TAGS = [
    "script",
    "link",
    "img",
    "picture",
];

type Child = string | ReactElement | ReactElement[];

const processHTML = (node: Node): Child[] => {
    const children: Child[] = [];

    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            children.push(child.textContent || "");
            continue;
        }

        const nodeName = child.nodeName.toLowerCase();
        if (BANNED_TAGS.includes(nodeName)) {
            console.log(`Found unsupported tag ${nodeName}`);
            continue;
        }

        let grandchildren: Child[]|undefined;

        if (child.hasChildNodes()) {
            grandchildren = processHTML(child);    
        }

        const attributes: Record<string, string|number|null> = {};
        const el = child as Element;

        for (const attr of el.getAttributeNames()) {
            attributes[attr] = el.getAttribute(attr);
        }

        const key = children.length;

        let newChild: Child;

        if (nodeName === "a") {
            newChild = (
                <BaseLink
                    key={key}
                    {...attributes}
                    target="_blank"
                    href={attributes.href as string ?? ""}
                >
                    {grandchildren}
                </BaseLink>
            );
        }
        else {
            newChild = createElement(nodeName, {
                key,
                ...attributes,
            }, ...children)
        }

        children.push(newChild);
    }

    return children;
};

export const Description = (
    {
        children,
        typographyProps,
    }: {
        children: string;
        typographyProps?: TypographyProps;
    }
) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(children, "text/html");

    return (
        <Typography
            component="div"
            {...typographyProps}
        >
            {processHTML(parsed.body)}
        </Typography>
    );
};
