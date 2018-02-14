# group-formation

JavaScript tool to turn group survey spreadsheet data into effective groups based on scheduling, preference, and expertise criteria.

##  Instructor-formed teams vs. self-selection

"Instructors should form teams rather than allowing students to self-select. Left to their own devices, the stronger students  in the class will tend to seek one another out, leaving the weaker ones to shift for themselves, which works to no one’s  benefit" (Oakley, 2004).

## Collecting the data needed to form teams

"The information needed to form teams may be obtained by having all students fill out the Getting to Know You form on the first day of class. This form provides information related to ability levels and times available to meet outside class" (ibid).

In our case, we used a [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdaGdsfEyLQPZ91zLUhJIeO74d_eT-h8zdAjB82SVlZv7wEfQ/viewform) to gather information about student availability, research interests, and experience which was compiled in a [Google Sheet](https://docs.google.com/spreadsheets/d/1kDA-b332JVJx4G0ZJzhjEVE7EsX8utVH5lfgmQZjUJ4/edit?usp=sharing). This data was lightly digested in [another sheet](https://docs.google.com/spreadsheets/d/1kDA-b332JVJx4G0ZJzhjEVE7EsX8utVH5lfgmQZjUJ4/edit#gid=1315917977) where the data was summarized and field types were indicated. Note that the header row is used only to present the results in a meaningful way.

## Criteria for team formation

"We propose forming three- to four-person teams for most assignments, attempting to observe the following two guidelines to  the greatest extent possible:

1. Form teams whose members are diverse in ability levels and who have common blocks of time to meet outside class.
2. In the first two years of a curriculum, avoid isolating at-risk minority students on teams/

There is no consensus in the literature on the optimal team size, but most authors agree that the minimum for most team assignments is three and the maximum is five" (ibid). 

In the group-formation script, you can set the ideal, minimum, and maximum group sizes. As per Oakley, default values are set to 4, 3, and 5 respectively.

## Weighing team formation criteria

To support homogeneous grouping, the script supports (S)cheduling and (T)opics criteria. To support heterogeneous grouping,  the script supports (D)iversity criteria such as skill, work habits, etc. Possibly, in the future this will be abstracted  to a set of homogeneous fields (A, B, C) and heterogeneous grouping (X, Y, Z).

Oakley provides no guidance on how these criteria are aggregated or scored. In this script, all values are normalized, scaled, weighted, and aggregated. Users may adjust the weight of each criteria. By default, group size and scheduling are given equal weight, with topics defaulting to 1/5 less and diversity 2/5 less.

## Team Formation

With a spreasheet that collects participants names (column A), header data (row 1), field types (row 2), and quantifiable data (everything on row 3 and beyond), we can cut-and-paste spreadsheet data straight into the input form field of the group-formation script.

Here are important notes about the expected data:

1. Each record is on a new line.
2. Use tab separators as when cutting and pasting from Google Docs or Excel.
3. The first line is a required header row.
4. The second line is a required field type indicator, e.g., S, T, or D.
5. Field types can be:
    * (S)cheduling fields are matched as closely as possible in groups. (Higher numbers indicate more available in a given time.)
    * (T)opic fields are matched as closely as possible with (typically) less priority. (Higher numbers indicate particpant is more interested in topic.)
    * (D)iversity fields are distributed over groups, e.g. expertise, leadership. (Higher numbers indicate more expertise/skill.)
6. Values may be any real numbers on any scale. Since they are normalized, many scale systems (even in different columns) will work, e.g., 0/1, 0-1, 1-10, 1-100, etc.

Submitting the form will result in the script attempting to calculate the optimum grouping.

## Converting groups into effective teams

This script only covers the very first step of creating effective teams, namely group formation. There is much that can be  learned about setting expectations, agreeing to guidelines, checkins, and milestones in the references.

## References

Oakley, Barbara, et al. "Turning student groups into effective teams." Journal of student centered learning 2.1 (2004): 9-34. (http://owww.brookes.ac.uk/services/ocsld/group_work/turnin_student_groups_into_effective_teams.pdf)

Potosky, Denise, and Janet M. Duck. "Forming teams for classroom projects." Developments in Business Simulation and Experiential Learning 34 (2014). (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.454.5859&rep=rep1&type=pdf)
