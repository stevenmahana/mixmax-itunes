# iTunes Slash Command for Mixmax

This is an open source Mixmax Slash Command. See <http://sdk.mixmax.com/docs/overview-slash-commands> for more information about how to use this example code in Mixmax.

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the typeahead URL (to return a JSON list of typeahead results), run:

```
curl http://localhost:9145/typeahead?text=sweet%20momma
```

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:9145/resolver?text=297957761
```

To simulate locally how Mixmax makes a bad call to the resolver URL (which results in random song being selected), run:

```
curl http://localhost:9145/resolver?text=asdasdasd
```

## Mixmax Install

1. Name: `iTunes`
2. Command: `itunes`
3. Placeholder: `[Search]`
4. Typeahead API URL: `http://localhost:9145/typeahead`
5. Resolver API URL: `http://localhost:9145/resolver`

## Unit Test

1. `npm test`