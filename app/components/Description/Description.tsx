import { ReactElement, createElement } from "react";
import { Link } from "@mui/material";
import NextLink from "next/link";

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
                <Link
                    key={key}
                    component={NextLink}
                    {...attributes}
                    target="_blank"
                    href={attributes.href as string ?? ""}
                >
                    {grandchildren}
                </Link>
            );
        }
        else {
            newChild = createElement(nodeName, {
                key,
                children: grandchildren,
                ...attributes,
            })
        }

        children.push(newChild);
    }

    return children;
};

export const Description = (
    {
        children,
    }: {
        children: string;
    }
) => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(children, "text/html");

    return (
        <div>
            {processHTML(parsed.body)}
        </div>
    );
};
