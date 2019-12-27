---
path: "/posts/ruby-hash.md"
title: Ruby Hash
author: Djoe Pramono
date: "2016-09-14"
categories: ruby
---

A **hash** is an associative array, which is pretty much an array with key-value pairs of which the keys are unique.

In Ruby it can be denoted in many ways

```ruby
hash1 = {:name => 'John', :age => 24}
hash2 = {name: 'John', age: 24}       # recommended way, though I don't use it as much
hash1 === hash2                       # returns true
```

If you are passing a **hash** as a parameter to a function, there are even more ways

```ruby
def accept_hash(a_hash)
    puts a_hash
end

accept_hash({:name => 'John', :age => 24}) # non-recommended way
accept_hash({name: 'John', age: 24})       # recommended way
accept_hash(name: 'John', age: 24)         # short version of the recommended way.
                                           # This can be confusing though
```

That doesn't stop there. If the function is accepting a value and a hash, things get weirder

```ruby
def accept_value_and_hash(v, h)
    puts v
    puts h
end

accept_value_and_hash('a teacher', name: 'John', age: 24)
# Output:
# a teacher
# {:name=>"John", :age=>24}
```

As you can see, Ruby is smart enough (*or too much magic, imho*) to combine
`... , name: 'John', age: 24` into a hash.

**This only works if to-be-hash parameters are supplied last**, i.e. below won't work

```ruby
accept_value_and_hash(name: 'John', age: 24, 'a teacher')

# Output:
# syntax error, unexpected ')', expecting =>
```

## Notes

If you are coming from a PHP / Javascript background like me then the following notes might be useful

### Hash is a special array. But in ruby **hash** and **array** are different

```ruby
a_hash = {:name=>"John", :age=>24}   # encapsulated with {}
an_array = ['John', 'Sue']           # encapsulated with []
```

### A group of hashes is still an array

```ruby
x = [{:name => 'John'}, {:name => 'Sue'}]
```