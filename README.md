# Symbolic FORTH Project



## Command Line

- install QuickJS

```
clear; qjs ./source/sf.js ./source/test.forth
```

or 


### CSV 

```
./qjs ./source/sf.js ./source/clean-csv.sforth /home/erik/Downloads/medicalClaimSummary.csv > ~/Documents/unitedhealthcare.csv
```

```
clear; ./qjs ./source/sf.js ./source/csv-report.sforth ~/Documents/unitedhealthcare.csv date
```
summary field choices are date, provider, coverage-type

```bash
 clear; ./qjs ./source/sf.js ./source/test2.sforth
```

Testing:

```bash
clear; ./qjs  ./source/qjs/testing.js
```

Here is the Kate syntax file:


./.local/share/org.kde.syntax-highlighting/syntax/symbolic-forth.xml
