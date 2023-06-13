---
path: "/posts/a-case-study-of-date-and-time"
title: "A Case Study of Date and Time"
date: "2020-08-08"
author: "Djoe Pramono"
cover: "../media/tyler-harris-dJHh3fxXuK4-unsplash.jpg"
tags: ["system-design", "sql", "data"]
---

![](./media/tyler-harris-dJHh3fxXuK4-unsplash.jpg)

In IT, dealing with date and time, can be quite challenging. There are a lot of things to consider and things can be quite complicated especially when you need to make changes to an already existing system.
The purpose of this blog post is to surface the importance of thinking about your data type more carefully, especially when you are dealing with date and time.

## The Basic

To limit the scope, we would only talk about three data types
- `DATE`, which represents a date
- `DATETIME`, which represents a date with a time component
- `TIMESTAMP`, which represents a date, time and a timezone offset 

| | Sample |
|--- |--- |
| ``DATE``    | 2020-02-23             |
| `DATETIME`  | 2020-02-23 18:09:18    |
| `TIMESTAMP` | 2020-02-23 18:09:18+00 |

Pretty simple eh? But sometimes some people forgot that only `TIMESTAMP` can represent an absolute value of time. Depending on the function you use to deal with  `DATE` and `DATETIME`, it may give you a different absolute value.

## Case Study

You live in Melbourne (UTC+10) and you just inherited and are now responsible for a legacy database that stores user registrations in `DATETIME` format. One day, an account manager asks you to graph the user registrations for the last 1 month.

It sounds like a simple task, but if you have been dealing with data that contains all sort of time value for a long time. There are a few alarms bells that should get you on your toes. Let's pretend that you are having this conversation with your colleague, John.

### "Since there is no timezone explicitly stored, the timezone for the data should be UTC or UTC+10. We just need to check the configuration"
Yes, you could check the timezone of your host machine. You also need to check if your database takes the host machine timezone configuration into account, or if it has its own configuration. But it's not that simple.

Since we have been saving the registration in `DATETIME` you cannot 100% sure that when the data was stored, it was at the `DATETIME` + the current timezone config. Who knows the timezone settings was changed a month ago. If an event data is stored without representing its absolute value, some of its data is  lost.


### "We should've stored the registration time in UTC"
This is a bit misleading, UTC is not a type, `TIMESTAMP` is. 2020-02-23 18:09:18+00 UTC time is the same as 2020-02-24 04:09:18+10 Melbourne time.

Most of the time when people say this, they should've said "_we should've stored the user registration in timestamp format_". When storing a timestamp, you don't have to always store it in UTC. UTC or UTC+10 are just a display format.

However, choosing the right display format is still important. Especially because, when you pass the data across to the next micro service or from backend to frontend, this `DATETIME` would be transmitted as a `STRING`.

### "Fine, but it's a common sense to store all time related field in `TIMESTAMP` "
In this particular case, yes. It's good to store an event in `TIMESTAMP`. In fact, you MUST store an event as a `TIMESTAMP`. `TIMESTAMP` has the most information in it and it is meant to represent absolute value of a time. This is very useful if you want to do some analysis later.

But calling to store every time related fields in a `TIMESTAMP` is a bit of a stretch. There are situations where storing in `DATE` or `DATETIME` can be good. Let's start with the most obvious example: storing a user birthday. Should we store this in `TIMESTAMP` ? Of course not, `DATE` is better in this case.

How about storing an appointment time? This is a tricky one, but in my opinion we should store it a `DATETIME` format. Why? Because when making an appointment most people do not care about the timezone. Imagine that you try to make an appointment for tomorrow and there is a day light saving. Even when the timezone change, the date and time of the appointment does not. If the appointment is at 9 AM tomorrow, it will be held at 9 AM tomorrow regardless of the timezone offset.

Sometimes timezone can even change with a very short notice just because a government decide to do so. There are case studies which you can read [here](https://codeofmatt.com/on-the-timing-of-time-zone-changes/). If what you are trying to record doesn't need to care about the timezone, record it in `DATETIME`

So depending on the situation, we should choose carefully whether we should store data in `DATE` , `DATETIME`, or `TIMESTAMP`. 

### "Actually for the graph, we would need to break the data into dates. But does that mean we will lose some information?"
Yup, and that is fine. The raw event data can be stored in `TIMESTAMP` but they can then be converted into `DATE` for easier processing both by our brain and computer's logic. Losing some information, in this case time and timezone, is not necessarily a bad thing.

Let's say that the user registrations are stored in UTC timestamp, and it needs to be piped into a series of data transformation pipeline. In this case we need to take into account what is the final product that come out in the end. If we need to aggregating the events based on Melbourne dates, then it might make more sense to extract all of the required information from the raw data table into another table and transform the `TIMESTAMP` into `DATE`. 

Just make sure when transforming `TIMESTAMP` into `DATE`, take the timezone into consideration. We must not take a shortcut, where we turn `DATETIME` into a `STRING` and truncate it to get the date. Instead we should use the built in functions, to get the `DATE` value out of `TIMESTAMP` . The catch though, the syntax might differ from one database to another.

This makes the next step in the pipeline easier, since they only need to worry about `DATE` and they don't need to do the `DATETIME` to `DATE` transformation from then on.

### "But then what happen if we actually needs the time component?" 
Then we need to go back all the way to the raw data table. We must not grab the data from the derived table. 

One thing that could help here is to have a derived table that stores the event in `DATETIME`. This would help some analysis like how many users registered in the morning. But of course this depends on the business requirement. Keep the full data for as long as we need it. Once we don't, shed things that we don't need to make things lightweight for the next step.

When dealing with a data pipeline, it's better to spend sometime understanding the end-to-end process including the data type used as an input or output at every steps.

Be careful when trying to compare two different types. For example, when the graph that you build for the account managers suddenly need to have a date input where it is used to graph the registration time of a user for a given date. Then when building the solution you should first convert the `DATE` input into two `TIMESTAMP` . One representing the beginning of the day and another one representing the end of the day. In other words you need a range. Only when you have the same type between data and input parameter, in this case `TIMESTAMP`, you can then proceed to the calculation.

Alternatively you can convert all of the registration timestamps into dates and store it in an intermediate table. Then you can use the input without any transformation and the calculation shall proceed in `DATE` format.

### "How about the frontend?"
It is similar. You display the data in a display format that is suitable for its purpose. You can display a date for a birthday, a date and time for a booking time, and a timestamp for an event log.

Please make sure that you use a library to display these especially when the data source is a timestamp in `STRING` format. Do not ever try to process it yourself. Let the library help you to convert `STRING` into the appropriate display with the correct timezone settings. 

Note that there are two timezone settings that you need to be aware of. One is the user machine settings and another one is the browser settings. These two settings can have different timezone setup

### "And that's it I guess"
Yes, that's it for this blog. Thank you for reading and any feedbacks are welcomed.