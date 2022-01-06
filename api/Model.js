const path = require('path');
const _ = require('lodash');
const { open } = require('fs/promises');
const { existsSync } = require('fs');

class Model {
    constructor(name, schema) {
        if (Model.isValidSchema(schema)) {
            this.schema = schema;
            this.name = name;
            this.fileName = `${Model.dbPath}/${name}.json`;
            Model.schemas[this.name] = this.schema;
            Model.models[this.name] = this;
        }
    }

    schema;
    name;
    fileName;
    cache;
    autoIncField;
    nextValue;
    reference;
    referenceFrom;

    async static init(name, schema) {
        const model = new Model(name, schema);

        // Create table if it doesn't exist
        await Model.createTable(model.fileName);
        // Cache data from file
        await model.get();

        // Get auto incremented field
        _.find(model.schema, (item, index) => {
            if (item instanceof Object && item !== Object) {
                if (item.autoIncrement) {
                    model.autoIncField = index;
                }
            }
        });

        // Set nextValue if auto incremented value exists
        if (model.autoIncField) {
            _.findLast(model.cache, (item) => {
                if (item[model.autoIncField]) {
                    model.nextValue = item[model.autoIncField];
                }
            });
        }

        _.find(model.schema, (item, index) => {
            if (item instanceof Object && item !== Object) {
                if (item.ref) {
                    model.reference = item.ref;
                    model.referenceFrom = index;
                }
            }
        });

        return model;
    }

    has(fieldName) {
        return this.schema[fieldName] !== undefined
    }

    async get(fieldName = undefined, value = undefined) {
        // Open file and read it, cache result
        const file = await open(this.fileName, 'r');
        let result = await file.readFile();
        result = result.toString();
        result = JSON.parse(result);
        this.cache = result;
        this.cachePopulated = result;

        if (this.reference) {
            const [refSchemaName, refFieldName] = this.reference.split(':');
            const refModel = Model.models[refSchemaName];

            if (refModel) {
                this.refersValues = await refModel.get(refFieldName);
                this.cachePopulated = await this.cache.map(async (item) => {
                    item[this.referenceFrom] = this.refers // На этом моменте я подумал, что буду юзать монго :D
                })
            } else {
                throw new Error(`Schema "${refSchemaName}" unregistered`);
            }
        }

        if (fieldName === undefined && value === undefined) {
            return result;
        } else {
            if (fieldName === undefined) {
                throw new Error('First argument cannot be undefined');
            } else {
                return _.filter(result, [fieldName, value]);
            }
        }
    }

    async set(id, fieldName, value) {
        // Use cached result set new value and write into file
        const index = _.findIndex(this.cache, ['id', id]);

        if (index === -1) {
            throw new Error('No such ID, use <model>.new(fieldName, value) to add new');
        } else {
            if (this.cache[fieldName] === undefined) {
                throw new Error('No such field');
            }
            if (value instanceof Model.getPropertyType(this.name, fieldName)) {
                this.cache[index][fieldName] = value;
            } else {
                throw new Error('Invalid type');
            }
        }

        const file = await open(this.fileName, 'w');
        const cacheJson = JSON.stringify(this.cache, undefined, 4);

        await file.write(cacheJson);
        await file.close();
    }

    async new(fieldName, value)

    static dbPath = path.normalize(`${__dirname}/../`);
    static supportedTypes = [Number, String, Object, Array];
    static schemas = { };
    static models = { };
    static mapOptionsValidate = {
        'type': (value) => {
            if (Model.isValidType(value)) {
                return { valid: true }
            } else {
                return { valid: false, message: 'Property "{name}" has invalid type' }
            }
        },
        'autoincrement': (value, type) => {
            if (type === Number && value instanceof Boolean) {
                return { valid: true }
            } else {
                return {
                    valid: false,
                    message: 'Property "{name}" must has Number and "autoincrement" must be boolean'
                }
            }
        },
        'ref': (value, type) => {
            const [refSchemaName, refFieldName] = value.split(':');
            const refSchema = Model.schemas[refSchemaName];

            if (refSchema === undefined) {
                return { valid: false, message: `Schema ${refSchemaName} unregistered` }
            } else {
                if (refSchema[refFieldName] === undefined) {
                    return { valid: false, message: `Schema ${refSchemaName} has not field ${refFieldName}` }
                } else {
                    const refSchemaFieldType = Model.getPropertyType(refSchema, refFieldName);
                    if (refSchemaFieldType !== type) {
                        return {
                            valid: false,
                            message: `Field ${refFieldName} in scheme ${refSchemaName} has a different type from field ${refFieldName} in scheme {name}`
                        }
                    }
                }
            }

            return { valid: true }
        },
        'unique': (value) => value instanceof Boolean,
    };

    static async createTable(path) {
        let file;

        if (!existsSync(path)) {
            file = await open(path, 'w');
            await file.close();
        }
    }

    static isValidSchema(schema) {
        for (let [name, value] of Object.entries(schema)) {
            if (Model.isValidType(value) || value instanceof Object) {
                if (value instanceof Object && value !== Object) {
                    for (let [fieldName, fieldValue] of Object.entries(schema)) {
                        const fieldValidator = Model.getFieldValidator(fieldName);
                        const currentPropType = Model.getPropertyType(schema, name);

                        if (fieldValidator === undefined) {
                            throw new Error(`Property "${name}" has invalid option "${fieldName}"`);
                        } else {
                            const validationResult = fieldValidator(fieldValue, currentPropType);

                            if (!validationResult.valid) {
                                throw new Error(validationResult.message.replace(/{name}/gi, name));
                            }
                        }
                    }
                }
            } else {
                throw new Error(`Property "${name}" has invalid type`);
            }
        }

        return true;
    }

    static isValidType(type) {
        return Model.supportedTypes.indexOf(type) !== -1;
    }

    static getFieldValidator(fieldName) {
        return Model.mapOptionsValidate[fieldName];
    }

    static getPropertyType(schema, name) {
        const field = schema[name];

        if (field === undefined) {
            throw new Error(`Schema has not property "${name}"`);
        } else {
            if (Model.isValidType(field)) {
                return field;
            } else {
                return field.type;
            }
        }
    }
}
