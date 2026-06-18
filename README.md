# Symbolic FORTH Project



## Command Line

- install QuickJS

```
clear; qjs ./source/sf.js ./source/test.forth
```

or 


### CSV 

```
./qjs ./source/sf.js ./source/clean-csv.sforth /home/erik/Downloads/medicalClaimSummary.csv >SYM /Documents/unitedhealthcare.csv
```

```
clear; ./qjs ./source/sf.js ./source/csv-report.sforthSYM /Documents/unitedhealthcare.csv date
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

```bash
kwrite ~/.local/share/org.kde.syntax-highlighting/syntax/symbolic-forth.xml
```

Latest:


erik@thinkypaddy:~/Work/symbolic-forth$ clear; ./qjs ./source/sf.js ./source/dat.sforth /media/erik/DATADRIVE/Work/ETA/export/cleaned/precinct-results.csv.data.dat

clear; ./qjs ./source/sf.js ./source/csv-to-dat.sforth /media/erik/DATADRIVE/Work/ETA/export/cleaned/precinct-results.csv 


syntax highlighter for kate is here:

/home/erik/.local/share/org.kde.syntax-highlighting/syntax/symbolic-forth.xml


Virginia

downloaded file from link provided on ETA GH

/home/erik/Work/symbolic-forth/__local_only/elections/data/raw/US_VA/2024/Election Results_e5b689ae-a931-4b8a-a5f7-7392e9571c61(1).csv

clear; ./qjs ./source/sf.js ./source/csv-to-dat.sforth ./__local_only/elections/data/raw/US_VA/2024/Election_Results_e5b689ae-a931-4b8a-a5f7-7392e9571c61
