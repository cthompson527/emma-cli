# Emma Boilerplates

> A Github App which manages indexing of the boilerplates.

## Events

1. Repository is installed

- Check for the configuration.
- Validate and index boilerplates.

2. Push event is triggered in repository.

- Check for changes in configuration.
- Validate and index boilerplates.

3. Repository is removed.

- Delete boilerplates in the repository.

## API

Every boilerplate is indexed with Prisma, and pushed to Algolia.

## License

MIT @ Matic Zavadlal
