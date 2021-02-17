CREATE TABLE Accounts (
    id bigserial primary key,
    username varchar(100) unique not null,
    password varchar(100) not null,
    email varchar(250) not null,
    CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

CREATE TABLE Dancers (
    did bigserial,
    name varchar(100),
    aid int not null,
    primary key (did, aid),
    foreign key (aid) references Accounts(id) on delete cascade
);

CREATE TABLE Sessions (
    sid bigserial,
    aid int not null references Accounts(id),
    timestamp date,
    primary key (aid, sid)
);

CREATE TABLE Moves (
    mid bigserial,
    move varchar(50),
    delay numeric,
    accuracy numeric,
    timestamp timestamp,
    aid int not null,
    did int not null,
    sid int not null,
    primary key (mid, did, sid),
    foreign key (aid, did) references Dancers(aid, did) on delete cascade,
    foreign key (aid, sid) references Sessions(aid, sid) on delete cascade
);

CREATE Table Positions (
    pid bigserial,
    position varchar(50),
    timestamp timestamp,
    delay numeric,
    aid int not null,
    did int not null,
    sid int not null,
    foreign key (aid, did) references Dancers(aid, did) on delete cascade,
    foreign key (aid, sid) references Sessions(aid, sid) on delete cascade,
    primary key (pid, did, sid)
);

-- dummy data
insert into accounts(username, password, email) values ('kangming', 'password', 'kangming@u.nus.edu');

insert into dancers(aid, name) values (1, 'bob');
insert into dancers(aid, name) values (1, 'sally');
insert into dancers(aid, name) values (1, 'tom');

insert into sessions(aid, timestamp) values(1, NOW());