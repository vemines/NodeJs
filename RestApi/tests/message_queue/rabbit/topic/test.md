// Example for send mail with route. Each beween dot is route (can empty)

\topic> node receive.mail 'dev.test.lead'       // 1st teminal
\topic> node receive.mail '*.test'              // 2nd teminal
\topic> node receive.mail '#.lead'              // 3rd teminal
\topic> node receive.mail '*.test.*'            // 4th teminal



\topic> node send.mail 'dev.test' 'hello dev and test'                       // 2nd teminal receive
\topic> node send.mail 'dev.test.lead' 'hello dev and test and lead'         // 3rd and 1st and 4th teminal receive

1. abc.*.def.*:

Matches routing keys with the following structure:
Matches:
    abc.xyz.def.ghi
    abc.123.def.456
    abc.anything.def.here

Not Matches:
Missing 'def':
    abc.xyz.ghi
    abc.anything.else
Incorrect order:
    def.abc.xyz.ghi
    xyz.abc.def.123
Missing 'abc':
    def.xyz.123
    anything.def.456


2. abc.#.def.#:

Matches:
    abc.def (due to # matching zero words)
    abc.xyz.def
    abc.multiple.words.here.def.and.more

Not Matches:
Missing 'abc' and 'def':
    xyz.123.ghi
    anything.else.here
Incorrect order (even with wildcards):
    def.#.abc.#
    xyz.#.abc.#.def