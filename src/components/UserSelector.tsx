import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { User } from '../types/User';
import { getUsers } from '../api/users';
import { actions as usersActions } from '../features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Loader } from './Loader';

type Props = {
  value: User | null;
  onChange: (user: User) => void;
};

export const UserSelector: React.FC<Props> = ({
  // `value` and `onChange` are traditional names for the form field
  // `selectedUser` represents what actually stored here
  value: selectedUser,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(state => state.users);

  useEffect(() => {
    dispatch(usersActions.setLoading(true));
    getUsers()
      .then(usersFromServer => {
        dispatch(usersActions.set(usersFromServer));
      })
      .catch(() => {
        dispatch(usersActions.setError('Something went wrong'))
      })
      .finally(() => dispatch(usersActions.setLoading(false)));
  }, []);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const handleDocumentClick = () => {
      setExpanded(false);
    };

    document.addEventListener('click', handleDocumentClick);

    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [expanded]);

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': expanded })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {
            setExpanded(current => !current);
          }}
        >
          <span>
            {selectedUser?.name || 'Choose a user'}
          </span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {loading && (
            <Loader />
          )}
          {!error ? (
            users.map(user => (
              <a
                key={user.id}
                href={`#user-${user.id}`}
                onClick={() => {
                  onChange(user);
                }}
                className={classNames('dropdown-item', {
                  'is-active': user.id === selectedUser?.id,
                })}
              >
                {user.name}
              </a>
            ))
          ) : (
            <p>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
