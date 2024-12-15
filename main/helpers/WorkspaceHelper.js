const { readdirSync } = require('fs');
const { join } = require('path');

const getWorkspace = (absolute, path) => {
    const result = [];

    const items = readdirSync(path, { withFileTypes: true });

    for (const item of items) {
        const itemPath = join(path, item.name);

        const workspace = absolute.split('\\').slice(-1)[0];

        const filePath = itemPath.replace(absolute, '').replace(/\\/g, '/').slice(1);

        const uri = workspace + '/' + filePath;

        if (item.isDirectory()) {
            result.push({
                name: item.name,
                uri,
                children: getWorkspace(absolute, itemPath)
            });
        } else {
            result.push({
                name: item.name,
                uri
            });
        }
    }

    return result;
}

const pathToJson = (path, children) => {
    path = path.replace(/\\/g, '/');

    const parts = path.split('/');

    const build = (index) => {
        if (index >= parts.length)
            return null;

        const relativePath = parts.slice(0, index + 1).join('/');

        const node = {
            name: parts[index],
            uri: relativePath,
        };

        const child = build(index + 1);

        if (child)
            node.children = [child];

        if (index === parts.length - 1 && children)
            node.children = children;

        return node;
    }

    return build(0);
}

exports.getWorkspace = getWorkspace;

exports.pathToJson = pathToJson;

exports.default = {
    getWorkspace,
    pathToJson
}