# DAT Format

Although we work with CSV source files, for most purposes we convert these to DAT files. DAT, short for simply "Data", can be read in much faster.

The core of DAT is that each field is prefixed by its length. This means we do not need to parse CSV-style, in which we must inspect each character.

Each dat data set consists of three files. We do this for several reasons.

First, it eases processing, as each has a different format (although all are DAT-encoded); mixing multiple formats in one file slows down overall processing.

Second, processing the primary data DAT file is more straightforward if it just contains rows of data.

## metadata

metadata is information about the file, including the number of columns, the types of columns, the number of rows

The metadata is encoded as a single row, with known field names and size

The metadata section is also in dat format:

```
11 ColumnCount2 10 11 ColumnTypes10 SDNSSSSSSS 8 RowCount4 1234

```

## header

The header contains the column definitions, primarily the column identifiers.

foo bar baz

```
3 foo 3 bar 3 baz
```

hmm, what if it was a self-executing file?

10 column-count 1234 row-count 
A[SYM stringSYM dateSYM number ] column-types 
A[SYM fooSYM barSYM baz ] column-names

anyway, probably better, certainly more portable:

METADATA
11 ColumnCount 1 3 11 ColumnTypes 3 SDN 8 RowCount 1 6
COLUMNS
3 foo 3 bar 3 baz


and data is always like

3 foo 8 1/2/2036 3 1.2
3 foo 8 1/2/2036 3 1.2


## status

so after some wrangling i have the basics working

csv ouptput as a dat header and data file, separately.

the header is primitive - just the column labels.

since a dat file is at its heart just a sequence of fields, we can interpret the fields as we wish.

E.g.

COLUMNS N column1 column2 .. columnN
TYPES N type1 type 2 .. typeN

if we keep types as a single character, it is easy to tweak, though the format is not too difficult to edit by hand - one just needs to ensure the field size is correct.
